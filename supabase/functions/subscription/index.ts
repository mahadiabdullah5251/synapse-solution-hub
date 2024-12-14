import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface SubscriptionRequest {
  action: 'create' | 'cancel' | 'update' | 'check_limits';
  planId?: string;
  featureName?: string;
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Subscription function called with method:', req.method)
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the request body
    const { action, planId, featureName } = await req.json() as SubscriptionRequest
    console.log('Request payload:', { action, planId, featureName })

    // Get the user from the authorization header
    const authHeader = req.headers.get('Authorization')?.split('Bearer ')[1]
    if (!authHeader) {
      console.error('No authorization header provided')
      throw new Error('No authorization header')
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(authHeader)
    if (userError || !user) {
      console.error('Error getting user:', userError)
      throw new Error('Error getting user')
    }

    console.log('Processing request for user:', user.id)

    let result;
    switch (action) {
      case 'create':
        result = await handleSubscriptionCreate(supabaseClient, user.id, planId!)
        break
      case 'cancel':
        result = await handleSubscriptionCancel(supabaseClient, user.id)
        break
      case 'update':
        result = await handleSubscriptionUpdate(supabaseClient, user.id, planId!)
        break
      case 'check_limits':
        result = await checkUsageLimits(supabaseClient, user.id, featureName!)
        break
      default:
        throw new Error('Invalid action')
    }

    console.log('Operation completed successfully:', result)

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in subscription function:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

async function handleSubscriptionCreate(supabase: any, userId: string, planId: string) {
  const periodEnd = new Date()
  periodEnd.setMonth(periodEnd.getMonth() + 1) // Set period end to 1 month from now

  const { data, error } = await supabase
    .from('subscriptions')
    .insert({
      user_id: userId,
      plan_id: planId,
      current_period_end: periodEnd.toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return { success: true, subscription: data }
}

async function handleSubscriptionCancel(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .update({ status: 'canceled' })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return { success: true, subscription: data }
}

async function handleSubscriptionUpdate(supabase: any, userId: string, newPlanId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .update({ 
      plan_id: newPlanId,
      status: 'active',
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return { success: true, subscription: data }
}

async function checkUsageLimits(supabase: any, userId: string, featureName: string) {
  // First, get the user's subscription
  const { data: subscription, error: subError } = await supabase
    .from('subscriptions')
    .select('plan_id, status')
    .eq('user_id', userId)
    .single()

  if (subError) throw subError

  // Get usage count for the current month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { data: usage, error: usageError } = await supabase
    .from('usage_logs')
    .select('usage_count')
    .eq('user_id', userId)
    .eq('feature_name', featureName)
    .gte('created_at', startOfMonth.toISOString())
    .select()

  if (usageError) throw usageError

  // Calculate total usage
  const totalUsage = usage?.reduce((acc: number, curr: any) => acc + curr.usage_count, 0) || 0

  // Get limits based on plan
  const limits = getPlanLimits(subscription.plan_id)

  return {
    success: true,
    canUse: totalUsage < limits[featureName],
    currentUsage: totalUsage,
    limit: limits[featureName]
  }
}

function getPlanLimits(planId: string): Record<string, number> {
  const limits: Record<string, Record<string, number>> = {
    'starter': {
      'workflows': 5,
      'api_calls': 1000,
      'storage_gb': 10
    },
    'professional': {
      'workflows': 50,
      'api_calls': 10000,
      'storage_gb': 100
    },
    'enterprise': {
      'workflows': 500,
      'api_calls': 100000,
      'storage_gb': 1000
    }
  }

  return limits[planId] || limits['starter']
}