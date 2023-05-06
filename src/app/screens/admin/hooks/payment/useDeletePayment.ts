import { useCallback, useState } from 'react';
import { Api } from 'src/app/utils/Api';

export function useDeletePayment() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const deletePayment = useCallback((paymentId: number) => {
    (async function () {
      try {
        setLoading(true);
        await Api.delete(`/payments/${paymentId}`);
        setIsSuccess(true);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const resetPaymentDeleteSuccess = () => {
    setIsSuccess(false);
  };

  return {
    paymentDeleteError: error,
    paymentDeleteLoading: loading,
    isPaymentDeleted: isSuccess,
    resetPaymentDeleteSuccess,
    deletePayment,
  };
}
