import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

type Order = {
  id: number;
  date: string;
  items: any[];
  total: number;
  status: 'preparing' | 'delivering' | 'delivered';
  address: string;
  paymentMethod: string;
};

export default function OrderTracking({
  order,
  courierPosition,
  onClose
}: {
  order: Order;
  courierPosition: { lat: number; lng: number };
  onClose: () => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapRef.current && order.status === 'delivering') {
      const script = document.createElement('script');
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=&lang=ru_RU`;
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [order.status]);

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold mb-2">Заказ №{order.id}</h3>
            <Badge variant={order.status === 'delivered' ? 'secondary' : 'default'}>
              {order.status === 'preparing' && 'Готовится'}
              {order.status === 'delivering' && 'В пути'}
              {order.status === 'delivered' && 'Доставлен'}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="space-y-3 text-sm">
          <p className="flex items-center gap-2">
            <Icon name="MapPin" size={16} className="text-muted-foreground" />
            {order.address}
          </p>
          <p className="flex items-center gap-2">
            <Icon name="CreditCard" size={16} className="text-muted-foreground" />
            {order.paymentMethod}
          </p>
        </div>
      </Card>

      {order.status === 'preparing' && (
        <Card className="p-6 bg-primary/5">
          <div className="flex items-center gap-4">
            <div className="animate-spin">
              <Icon name="ChefHat" size={32} className="text-primary" />
            </div>
            <div>
              <p className="font-semibold mb-1">Ваш заказ готовится</p>
              <p className="text-sm text-muted-foreground">
                Наши повара уже работают над вашим заказом. Скоро он будет готов к доставке!
              </p>
            </div>
          </div>
        </Card>
      )}

      {order.status === 'delivering' && (
        <>
          <Card className="p-6 bg-primary/5">
            <div className="flex items-center gap-4 mb-4">
              <div className="animate-bounce">
                <Icon name="Truck" size={32} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold mb-1">Курьер в пути!</p>
                <p className="text-sm text-muted-foreground">
                  Ваш заказ уже едет к вам. Примерное время доставки: 20-30 минут
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div
              ref={mapRef}
              className="w-full h-64 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-green-100/50" />
              <div
                className="absolute w-12 h-12 bg-primary rounded-full shadow-lg flex items-center justify-center transition-all duration-1000"
                style={{
                  left: `${(courierPosition.lng % 1) * 100}%`,
                  top: `${(courierPosition.lat % 1) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <Icon name="Bike" size={24} className="text-white" />
              </div>
              <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg px-3 py-2 flex items-center gap-2">
                <Icon name="MapPin" size={16} className="text-primary" />
                <span className="text-sm font-medium">Ваш адрес</span>
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Примерное местоположение курьера на карте
            </p>
          </Card>
        </>
      )}

      {order.status === 'delivered' && (
        <Card className="p-6 bg-green-50 dark:bg-green-900/20">
          <div className="flex items-center gap-4">
            <div>
              <Icon name="CheckCircle" size={32} className="text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-green-700 dark:text-green-400 mb-1">Заказ доставлен!</p>
              <p className="text-sm text-green-600 dark:text-green-500">
                Спасибо за ваш заказ! Приятного аппетита!
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-4">
        <p className="font-semibold mb-3">Состав заказа:</p>
        <div className="space-y-2">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span>{item.name} {item.selectedSize && `(${item.selectedSize})`} x{item.quantity}</span>
              <span className="font-semibold">{item.price * item.quantity} ₽</span>
            </div>
          ))}
        </div>
        <div className="border-t mt-3 pt-3 flex justify-between font-bold">
          <span>Итого:</span>
          <span className="text-primary">{order.total} ₽</span>
        </div>
      </Card>
    </div>
  );
}
