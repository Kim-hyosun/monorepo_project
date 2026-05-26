'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Sparkles } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'

import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { RadioSegment } from '@/shared/ui/radio-segment'
import { sajuInputSchema, type SajuInput } from '@/lib/schema'

interface Props {
  onSubmit: (input: SajuInput) => void
  loading?: boolean
}

const TODAY = new Date().toISOString().slice(0, 10)

export function SajuForm({ onSubmit, loading }: Props) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<SajuInput>({
    resolver: zodResolver(sajuInputSchema),
    defaultValues: {
      birthDate: '1995-06-15',
      birthTime: '12:00',
      timeUnknown: false,
      gender: 'male',
      calendar: 'solar',
      birthCity: '서울',
    },
  })

  const timeUnknown = watch('timeUnknown')

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='bg-card text-card-foreground space-y-5 rounded-xl border p-6 shadow-sm'
    >
      {/* 생년월일 */}
      <div className='space-y-2'>
        <Label htmlFor='birthDate'>생년월일</Label>
        <Input
          id='birthDate'
          type='date'
          max={TODAY}
          aria-invalid={!!errors.birthDate}
          {...register('birthDate')}
          onClick={(e) => {
            try {
              ;(e.currentTarget as HTMLInputElement).showPicker?.()
            } catch {
              // 일부 브라우저에서 user gesture 인식 안 될 때 silently fallback
              // (그 경우 native 기본 picker icon 클릭은 여전히 동작)
            }
          }}
          className='cursor-pointer'
        />
        {errors.birthDate ? (
          <p className='text-destructive text-xs'>{errors.birthDate.message}</p>
        ) : null}
      </div>

      {/* 출생시각 */}
      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <Label htmlFor='birthTime'>출생 시각</Label>
          <label className='text-muted-foreground flex cursor-pointer items-center gap-1.5 text-xs'>
            <input
              type='checkbox'
              className='accent-primary size-3.5'
              {...register('timeUnknown')}
            />
            시간 모름
          </label>
        </div>
        <Input
          id='birthTime'
          type='time'
          disabled={timeUnknown}
          aria-invalid={!!errors.birthTime}
          {...register('birthTime')}
          onClick={(e) => {
            try {
              ;(e.currentTarget as HTMLInputElement).showPicker?.()
            } catch {
              // 일부 브라우저에서 user gesture 인식 안 될 때 silently fallback
              // (그 경우 native 기본 picker icon 클릭은 여전히 동작)
            }
          }}
          className='cursor-pointer'
        />
        {errors.birthTime ? (
          <p className='text-destructive text-xs'>{errors.birthTime.message}</p>
        ) : null}
      </div>

      {/* 성별 */}
      <div className='space-y-2'>
        <Label>성별</Label>
        <Controller
          control={control}
          name='gender'
          render={({ field }) => (
            <RadioSegment
              name='gender'
              value={field.value}
              onChange={field.onChange}
              className='w-full'
              options={[
                { value: 'male', label: '남성' },
                { value: 'female', label: '여성' },
              ]}
            />
          )}
        />
      </div>

      {/* 양음력 */}
      <div className='space-y-2'>
        <Label>달력</Label>
        <Controller
          control={control}
          name='calendar'
          render={({ field }) => (
            <RadioSegment
              name='calendar'
              value={field.value}
              onChange={field.onChange}
              className='w-full'
              options={[
                { value: 'solar', label: '양력' },
                { value: 'lunar', label: '음력' },
              ]}
            />
          )}
        />
        <p className='text-muted-foreground text-xs'>
          현재 API 는 윤달 직접 지원 X — 음력 선택 시 평월 기준
        </p>
      </div>

      {/* 출생 도시 */}
      <div className='space-y-2'>
        <Label htmlFor='birthCity'>출생 도시 (선택)</Label>
        <Input
          id='birthCity'
          type='text'
          placeholder='서울'
          aria-invalid={!!errors.birthCity}
          {...register('birthCity')}
        />
        <p className='text-muted-foreground text-xs'>진태양시 보정에 사용됩니다 (기본 서울)</p>
      </div>

      <Button type='submit' size='lg' disabled={loading} className='w-full'>
        {loading ? (
          <>
            <Loader2 className='animate-spin' />
            분석 중…
          </>
        ) : (
          <>
            <Sparkles />
            사주 분석하기
          </>
        )}
      </Button>
    </form>
  )
}
