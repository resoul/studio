import { useMemo } from 'react';
import { mockDeals } from '@/modules/dashboard/mock/deals';
import {
  Calendar,
  FileText,
  MessageCircle,
  Tag,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface DealCardProps {
  id: string;
  title: string;
  stage: string;
  userName: string;
  avatar: string;
  amount: number;
  currency?: 'USD' | 'EUR' | 'RUB';
  paymentDate?: Date;
  paymentType?: 'cash' | 'bank_transfer' | 'invoice';
  contractNumber?: string;
  discount?: number;
  status: string;
  comments: number;
  createdAt: Date;
  isActive: boolean;
}

export const DealCard = ({
  id,
  title,
  stage,
  userName,
  avatar,
  amount,
  status,
  comments,
  createdAt,
  isActive,
  paymentDate,
  paymentType,
  contractNumber,
  discount,
}: DealCardProps) => {
  return (
    <Card className="shadow-none">
      <CardContent className="space-y-3 p-5 pb-3.5">
        <div className="flex justify-between gap-2 items-center">
          <Badge variant="outline">
            {stage.charAt(0).toUpperCase() + stage.slice(1)}
          </Badge>

          {isActive && (
            <Badge variant="success" appearance="outline">
              Active
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <Avatar className="size-8">
            {avatar ? (
              <AvatarImage
                src={avatar}
                alt="User"
                className="object-cover transform-none"
              />
            ) : (
              <AvatarFallback>
                {userName
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col">
            <Link
              to={`/dashboard/deals/${id}`}
              className="font-medium text-foreground hover:text-primary"
            >
              {userName}
            </Link>
            <span className="text-xs text-muted-foreground">{title}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">
            $
            {new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(amount)}
          </span>
          {paymentDate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar size={14} />
              {paymentDate.toLocaleDateString()}
            </div>
          )}
          {paymentType && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Tag size={14} />
              {paymentType === 'cash'
                ? 'Cash'
                : paymentType === 'bank_transfer'
                  ? 'Bank Transfer'
                  : 'Invoice'}
            </div>
          )}
          {contractNumber && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <FileText size={14} />
              {contractNumber}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          {discount && discount > 0 && (
            <div className="flex items-center gap-1 font-medium text-xs text-foreground">
              <TrendingUp size={14} />
              {discount}% Discount
            </div>
          )}

          <Badge
            appearance="outline"
            variant={
              status.toLowerCase() === 'completed'
                ? 'success'
                : status.toLowerCase() === 'pending'
                  ? 'destructive'
                  : 'secondary'
            }
          >
            {status === 'in_progress'
              ? 'In progress'
              : status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-muted-foreground text-xs pt-2">
          <span>
            {Math.floor(
              (new Date().getTime() - createdAt.getTime()) /
                (1000 * 60 * 60 * 24),
            )}{' '}
            days ago
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle size={14} />
            {comments} comments
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

interface DealListProps {
  filter: 'today' | 'week' | 'completed' | 'all';
}

export function DealList({ filter }: DealListProps) {
  const deals = mockDeals;

  // Filter deals based on the active tab filter
  const filteredData = useMemo(() => {
    return deals.filter((deal) => {
      switch (filter) {
        case 'today':
          return deal.status === 'in_progress';
        case 'week':
          return deal.status === 'completed' && deal.priority === 'high';
        case 'completed':
          return deal.status === 'pending' && (deal.amount || 0) > 15000;
        default:
          return deal.status === 'in_progress' || deal.status === 'pending';
      }
    });
  }, [deals, filter]);

  return (
    <div className="grid grid-cols-4 gap-4 px-5 pt-2">
      {filteredData.map((deal) => (
        <div key={deal.id} className="w-full">
          <DealCard
            key={deal.id}
            id={deal.id}
            isActive={deal.status === 'in_progress'}
            stage={deal.priority || 'medium'}
            title={deal.title || ''}
            avatar={deal.avatar || ''}
            userName={deal.userName || ''}
            amount={deal.amount || 0}
            currency={deal.currency || 'USD'}
            paymentDate={deal.paymentDate || new Date()}
            paymentType={deal.paymentType || 'bank_transfer'}
            contractNumber={deal.contractNumber || ''}
            discount={deal.discount || 0}
            status={deal.status || 'pending'}
            comments={deal.comments || 0}
            createdAt={deal.createdAt || new Date()}
          />
        </div>
      ))}
    </div>
  );
}
