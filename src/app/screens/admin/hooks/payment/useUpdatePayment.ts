import { useCallback, useState } from 'react';
import { Api } from 'src/app/utils/Api';

export function useUpdatePayment() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const updatePayment = useCallback((id: number, data: any) => {
    (async function () {
      try {
        setLoading(true);
        await Api.put(`/payments/${id}`, data);
        setIsSuccess(true);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const resetPaymentUpdateSuccess = () => {
    setIsSuccess(false);
  };

  return {
    paymentUpdateError: error,
    paymentUpdateLoading: loading,
    isPaymentUpdated: isSuccess,
    resetPaymentUpdateSuccess,
    updatePayment,
  };
}
