'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { toast } from './toast';

interface ModelSettings {
  temperature: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

// Mock settings for when the API fails
const MOCK_SETTINGS: ModelSettings = {
  temperature: 0.7,
  maxTokens: 4000,
  topP: 0.95,
  frequencyPenalty: 0.0,
  presencePenalty: 0.0,
};

const settingsFormSchema = z.object({
  temperature: z.coerce.number().min(0).max(2),
  maxTokens: z.coerce.number().positive().int().optional(),
  topP: z.coerce.number().min(0).max(1).optional(),
  frequencyPenalty: z.coerce.number().min(-2).max(2).optional(),
  presencePenalty: z.coerce.number().min(-2).max(2).optional(),
});

type SettingsForm = z.infer<typeof settingsFormSchema>;

export function ProfileSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(false);

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<SettingsForm>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      temperature: 0.7,
      maxTokens: undefined,
      topP: undefined,
      frequencyPenalty: undefined,
      presencePenalty: undefined,
    },
  });
  
  const temperatureValue = watch('temperature');

  // Fetch user settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/profile/settings');
      
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      
      const data = await response.json();
      
      if (data.settings) {
        // Update form with existing settings
        Object.entries(data.settings).forEach(([key, value]) => {
          if (value !== null && key !== 'userId' && key !== 'createdAt' && key !== 'updatedAt') {
            // @ts-ignore - dynamically setting form values
            setValue(key, value);
          }
        });
      }
      setUseMockData(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Use mock data instead
      setUseMockData(true);
      Object.entries(MOCK_SETTINGS).forEach(([key, value]) => {
        if (value !== null) {
          // @ts-ignore - dynamically setting form values
          setValue(key, value);
        }
      });
      toast({
        type: 'error',
        description: 'Using sample settings: Database connection unavailable',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(data: SettingsForm) {
    setIsLoading(true);

    if (useMockData) {
      // Mock update
      setTimeout(() => {
        setIsLoading(false);
        toast({
          type: 'success',
          description: 'Settings updated in mock mode',
        });
      }, 500);
      return;
    }

    try {
      const response = await fetch('/api/profile/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      toast({
        type: 'success',
        description: 'Settings updated successfully',
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        type: 'error',
        description: error instanceof Error ? error.message : 'Failed to update settings',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-6 border rounded-lg bg-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">AI Model Settings</h3>
        {useMockData && (
          <div className="text-red-500 text-sm font-medium">
            Demo Mode: Using sample settings
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="temperature">Temperature: {temperatureValue?.toFixed(1) || 0.7}</Label>
            <span className="text-xs text-muted-foreground">Creativity level (0-2)</span>
          </div>
          <Input
            id="temperature"
            type="range"
            min="0"
            max="2"
            step="0.1"
            disabled={isLoading}
            {...register('temperature')}
          />
          {errors.temperature && (
            <p className="text-sm text-red-500">{errors.temperature.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="maxTokens">Max Tokens</Label>
            <span className="text-xs text-muted-foreground">Maximum response length</span>
          </div>
          <Input
            id="maxTokens"
            type="number"
            placeholder="Leave empty for default"
            disabled={isLoading}
            {...register('maxTokens')}
          />
          {errors.maxTokens && (
            <p className="text-sm text-red-500">{errors.maxTokens.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="topP">Top P</Label>
            <span className="text-xs text-muted-foreground">Token sampling probability (0-1)</span>
          </div>
          <Input
            id="topP"
            type="number"
            step="0.01"
            min="0"
            max="1"
            placeholder="Leave empty for default"
            disabled={isLoading}
            {...register('topP')}
          />
          {errors.topP && (
            <p className="text-sm text-red-500">{errors.topP.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="frequencyPenalty">Frequency Penalty</Label>
            <span className="text-xs text-muted-foreground">Repetition reduction (-2 to 2)</span>
          </div>
          <Input
            id="frequencyPenalty"
            type="number"
            step="0.1"
            min="-2"
            max="2"
            placeholder="Leave empty for default"
            disabled={isLoading}
            {...register('frequencyPenalty')}
          />
          {errors.frequencyPenalty && (
            <p className="text-sm text-red-500">{errors.frequencyPenalty.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="presencePenalty">Presence Penalty</Label>
            <span className="text-xs text-muted-foreground">Topic freshness (-2 to 2)</span>
          </div>
          <Input
            id="presencePenalty"
            type="number"
            step="0.1"
            min="-2"
            max="2"
            placeholder="Leave empty for default"
            disabled={isLoading}
            {...register('presencePenalty')}
          />
          {errors.presencePenalty && (
            <p className="text-sm text-red-500">{errors.presencePenalty.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Settings'}
        </Button>
      </form>
    </div>
  );
} 