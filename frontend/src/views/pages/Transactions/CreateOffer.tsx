import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface User {
  id: number;
  name: string;
  email: string;
}

const OfferSchema = z.object({
  plan_type: z.enum(['monthly', 'yearly', 'pay_as_you_go'], {
    required_error: 'Plan type is required',
  }),
  additions: z
    .array(z.enum(['refundable', 'on_demand', 'negotiable']))
    .min(1, { message: 'At least one addition is required' }),
  user: z.object(
    {
      id: z.number({ required_error: 'User id is required' }),
      name: z.string({ required_error: 'User name is required' }),
      email: z.string({ required_error: 'User email is required' }),
    },
    { required_error: 'User is required' }
  ),
  expired: z.preprocess(
    (val: any) => {
      if (val instanceof Date) return val;
      if (typeof val === 'string' && val.trim() !== '') return new Date(val);
      return undefined;
    },
    z
      .date()
      .refine((date: any) => !isNaN(date.getTime()), { message: 'Invalid date provided' })
      .refine(
        (date: any) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date >= today;
        },
        { message: 'Expired date should not be before today' }
      )
  ),
  price: z.number({ required_error: 'Price is required' }),
});

type OfferFormData = z.infer<typeof OfferSchema>;

const CreateOffer: React.FC = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OfferFormData>({
    resolver: zodResolver(OfferSchema),
    defaultValues: {
      plan_type: undefined,
      additions: [],
      user: { id: 0, name: '', email: '' },
      expired: new Date(),
      price: undefined,
    },
  });

  const [users, setUsers] = useState<User[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [offerSent, setOfferSent] = useState(false);
  const [isUserNull, setIsUserNull] = useState(false);

  // Fetch users for autocomplete when input changes
  useEffect(() => {
    if (!inputValue) {
      setUsers([]);
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      const fetchUsers = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `https://dummy-1.hiublue.com/api/users?search=${inputValue}&page=1&per_page=5`,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }
          );
          const data = await response.json();
          setUsers(data.data);
        } catch (error) {
          console.error('Error fetching users:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue]);

  const onSubmit = async (data: OfferFormData) => {
    if (data.user.id === 0) {
      setIsUserNull(true);
      setTimeout(() => setIsUserNull(false), 2000);
      return;
    }
    console.log('Validated Data:', data);
    const payload = {
      plan_type: data.plan_type,
      additions: data.additions,
      user_id: data.user.id,
      expired: data.expired,
      price: data.price,
    };

    try {
      const response = await fetch('https://dummy-1.hiublue.com/api/offers', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error('Error submitting offer:', response.statusText);
      } else {
        const result = await response.json();
        console.log('Offer submitted successfully:', result);
        setOfferSent(true);
        setTimeout(() => setOfferSent(false), 2000);
      }
    } catch (error) {
      console.error('Error submitting offer:', error);
    }
  };

  useEffect(() => {
    if (offerSent) {
      reset();
    }
  }, [offerSent, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 max-w-3xl w-full mx-auto"
    >
      <div className="flex flex-col bg-white rounded shadow">
        {/* Header */}
        <div className="h-24 flex flex-col gap-1 justify-center border-b border-gray-300 px-4">
          <h2 className="text-xl font-semibold">Create Offer</h2>
          <p className="text-sm text-gray-500">Send onboarding offer to new user</p>
        </div>
        {/* Form Fields */}
        <div className="flex flex-col gap-4 p-4">
          {/* Plan Type */}
          <div>
            <label className="block text-sm font-medium text-gray-900">Plan Type</label>
            <Controller
              name="plan_type"
              control={control}
              render={({ field }) => (
                <div className="flex space-x-4 mt-1">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="pay_as_you_go"
                      checked={field.value === 'pay_as_you_go'}
                      onChange={field.onChange}
                      className="form-radio text-green-600"
                    />
                    <span>Pay As You Go</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="monthly"
                      checked={field.value === 'monthly'}
                      onChange={field.onChange}
                      className="form-radio text-green-600"
                    />
                    <span>Monthly</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="yearly"
                      checked={field.value === 'yearly'}
                      onChange={field.onChange}
                      className="form-radio text-green-600"
                    />
                    <span>Yearly</span>
                  </label>
                </div>
              )}
            />
            {errors.plan_type && (
              <p className="text-red-600 text-sm">{errors.plan_type.message}</p>
            )}
          </div>

          {/* Additions */}
          <div>
            <label className="block text-sm font-medium text-gray-900">Additions</label>
            <div className="flex space-x-4 mt-1">
              {['refundable', 'on_demand', 'negotiable'].map((option) => (
                <Controller
                  key={option}
                  name="additions"
                  control={control}
                  render={({ field }) => (
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={field.value.includes(option as any)}
                        onChange={(e) => {
                          const newValue = e.target.checked
                            ? [...field.value, option]
                            : field.value.filter((val: any) => val !== option);
                          field.onChange(newValue);
                        }}
                        className="form-checkbox text-green-600"
                      />
                      <span>
                        {option.charAt(0).toUpperCase() +
                          option.slice(1).replace('_', ' ')}
                      </span>
                    </label>
                  )}
                />
              ))}
            </div>
            {errors.additions && (
              <p className="text-red-600 text-sm">{errors.additions.message}</p>
            )}
          </div>

          {/* User Autocomplete */}
          <div>
            <label className="block text-sm font-medium text-gray-900">User</label>
            <Controller
              name="user"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="User"
                    value={value && value.name ? value.name : inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      onChange({ id: 0, name: '', email: '' });
                    }}
                    className="w-full border rounded p-2"
                  />
                  {loading && (
                    <div className="absolute right-2 top-2">
                      Loading...
                    </div>
                  )}
                  {users.length > 0 && inputValue && (
                    <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 max-h-40 overflow-y-auto">
                      {users.map((user) => (
                        <li
                          key={user.id}
                          onClick={() => {
                            onChange(user);
                            setInputValue(user.name);
                            setUsers([]);
                          }}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {user.name} - {user.email}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            />
            {isUserNull && <p className="text-red-600 text-sm">User is Required</p>}
          </div>

          {/* Expired */}
          <div>
            <label className="block text-sm font-medium text-gray-900">Expired</label>
            <Controller
              name="expired"
              control={control}
              render={({ field }) => {
                const dateStr =
                  field.value instanceof Date ? field.value.toISOString().slice(0, 10) : '';
                return (
                  <input
                    type="date"
                    value={dateStr}
                    onChange={(e) => {
                      const newDate = new Date(e.target.value);
                      field.onChange(newDate);
                    }}
                    className="w-full border rounded p-2"
                  />
                );
              }}
            />
            {errors.expired && (
              <p className="text-red-600 text-sm">{errors.expired.message}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-900">Price</label>
            <input
              type="number"
              placeholder="$ Price"
              {...register('price', { valueAsNumber: true })}
              className="w-full border rounded p-2"
            />
            {errors.price && <p className="text-red-600 text-sm">{errors.price.message}</p>}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button type="submit" className="w-28 h-12 bg-gray-900 text-white rounded">
          {offerSent ? 'Offer Sent' : 'Send Offer'}
        </button>
      </div>

      {/* Snackbar */}
      {offerSent && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded">
          Offer Sent successfully
        </div>
      )}
    </form>
  );
};

export default CreateOffer;
