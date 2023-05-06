import { useCallback, useState } from 'react';
import { Api } from 'src/app/utils/Api';

export function useCreatePayment() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const createPayment = useCallback((data: any) => {
    (async function () {
      try {
        setLoading(true);
        await Api.post(`/payments`, data);
        setIsSuccess(true);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const resetPaymentCreationSuccess = () => {
    setIsSuccess(false);
  }

  return {
    paymentCreationError: error,
    paymentCreationLoading: loading,
    isPaymentCreated: isSuccess,
    resetPaymentCreationSuccess,
    createPayment,
  };
}