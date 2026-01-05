import { DollarSign, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { trpc } from '../../lib/trpc';
import { Skeleton } from '../ui/skeleton';

interface PaymentDashboardProps {
  projectId: number;
}

const PaymentDashboard = ({ projectId }: PaymentDashboardProps) => {
  const { data: paymentPlan, isLoading } = trpc.clientPortal.getPaymentPlan.useQuery({ projectId });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'overdue':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'waived':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <Skeleton className="h-6 w-48 bg-slate-800" />
          <Skeleton className="h-4 w-64 bg-slate-800 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 bg-slate-800" />
        </CardContent>
      </Card>
    );
  }

  if (!paymentPlan) {
    return (
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-400" />
            Payment Plan
          </CardTitle>
          <CardDescription className="text-gray-400">
            No payment plan configured for this project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Payment plan will be set up by your project manager</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const installments = paymentPlan.installments || [];
  const totalPaid = installments
    .filter((inst) => inst.status === 'paid')
    .reduce((sum, inst) => sum + inst.amount, 0);
  const totalAmount = paymentPlan.totalAmount;
  const paymentProgress = totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0;

  const upcomingPayments = installments.filter(
    (inst) => inst.status === 'pending' && new Date(inst.dueDate) > new Date()
  );
  const overduePayments = installments.filter(
    (inst) => inst.status === 'pending' && new Date(inst.dueDate) <= new Date()
  );

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-400" />
          Payment Plan
        </CardTitle>
        <CardDescription className="text-gray-400">
          Track your project payments and installments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Overview */}
        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-white">
                ${(totalAmount / 100).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Amount Paid</p>
              <p className="text-2xl font-bold text-green-400">
                ${(totalPaid / 100).toFixed(2)}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Payment Progress</span>
              <span className="text-white font-medium">{paymentProgress}%</span>
            </div>
            <Progress value={paymentProgress} className="h-2" indicatorClassName="bg-green-500" />
          </div>
        </div>

        {/* Down Payment */}
        {paymentPlan.downPaymentAmount && paymentPlan.downPaymentAmount > 0 && (
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Down Payment</p>
                <p className="text-lg font-bold text-white">
                  ${(paymentPlan.downPaymentAmount / 100).toFixed(2)}
                </p>
              </div>
              <Badge className={paymentPlan.downPaymentPaid ? getStatusColor('paid') : getStatusColor('pending')}>
                {paymentPlan.downPaymentPaid ? 'Paid' : 'Pending'}
              </Badge>
            </div>
            {paymentPlan.downPaymentPaidAt && (
              <p className="text-xs text-gray-500 mt-2">
                Paid on {new Date(paymentPlan.downPaymentPaidAt).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {/* Overdue Payments Alert */}
        {overduePayments.length > 0 && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Overdue Payments</span>
            </div>
            <p className="text-sm text-red-300">
              You have {overduePayments.length} overdue payment{overduePayments.length > 1 ? 's' : ''} totaling $
              {(overduePayments.reduce((sum, inst) => sum + inst.amount, 0) / 100).toFixed(2)}
            </p>
          </div>
        )}

        {/* Installments */}
        <div>
          <h4 className="text-sm font-medium text-white mb-3">Payment Schedule</h4>
          <div className="space-y-3">
            {installments.map((installment, index) => {
              const isOverdue = installment.status === 'pending' && new Date(installment.dueDate) <= new Date();
              
              return (
                <div
                  key={installment.id}
                  className={`p-4 rounded-lg border ${
                    isOverdue
                      ? 'bg-red-500/5 border-red-500/30'
                      : 'bg-slate-800/50 border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-medium">
                          Installment #{index + 1}
                        </span>
                        <Badge className={getStatusColor(installment.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(installment.status)}
                            {installment.status}
                          </span>
                        </Badge>
                      </div>
                      {installment.description && (
                        <p className="text-sm text-gray-400">{installment.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">
                        ${(installment.amount / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Due: {new Date(installment.dueDate).toLocaleDateString()}</span>
                    </div>
                    {installment.paidAt && (
                      <>
                        <span>•</span>
                        <span>Paid: {new Date(installment.paidAt).toLocaleDateString()}</span>
                      </>
                    )}
                    {installment.linkedMilestone && (
                      <>
                        <span>•</span>
                        <span>Linked to milestone</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentDashboard;
