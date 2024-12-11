import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

export function useSubscription() {
  const [isLoading, setIsLoading] = useState(false)

  // Get current subscription
  const { data: subscription, isLoading: isLoadingSubscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('No session')

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .single()

      if (error) throw error
      return data
    },
  })

  // Create subscription mutation
  const createSubscription = useMutation({
    mutationFn: async (planId: string) => {
      setIsLoading(true)
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) throw new Error('No session')

        const { data, error } = await supabase.functions.invoke('subscription', {
          body: { action: 'create', planId }
        })

        if (error) throw error
        return data
      } finally {
        setIsLoading(false)
      }
    },
    onSuccess: () => {
      toast.success('Subscription created successfully')
    },
    onError: (error) => {
      toast.error(`Error creating subscription: ${error.message}`)
    }
  })

  // Cancel subscription mutation
  const cancelSubscription = useMutation({
    mutationFn: async () => {
      setIsLoading(true)
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) throw new Error('No session')

        const { data, error } = await supabase.functions.invoke('subscription', {
          body: { action: 'cancel' }
        })

        if (error) throw error
        return data
      } finally {
        setIsLoading(false)
      }
    },
    onSuccess: () => {
      toast.success('Subscription cancelled successfully')
    },
    onError: (error) => {
      toast.error(`Error cancelling subscription: ${error.message}`)
    }
  })

  // Check usage limits
  const checkUsageLimits = async (featureName: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('No session')

      const { data, error } = await supabase.functions.invoke('subscription', {
        body: { action: 'check_limits', featureName }
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error checking usage limits:', error)
      return { canUse: false, error: error.message }
    }
  }

  return {
    subscription,
    isLoading: isLoading || isLoadingSubscription,
    createSubscription,
    cancelSubscription,
    checkUsageLimits
  }
}