import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'pizza' | 'snacks' | 'drinks' | 'combo';
  sizes?: { name: string; price: number }[];
};

type Order = {
  id: number;
  date: string;
  items: any[];
  total: number;
  status: 'preparing' | 'delivering' | 'delivered';
  address: string;
  paymentMethod: string;
};

export default function AdminPanel({
  orders,
  menuItems,
  onUpdateOrderStatus,
  onUpdateMenuItem,
  onDeleteMenuItem
}: {
  orders: Order[];
  menuItems: MenuItem[];
  onUpdateOrderStatus: (orderId: number, status: Order['status']) => void;
  onUpdateMenuItem: (item: MenuItem) => void;
  onDeleteMenuItem: (itemId: number) => void;
}) {
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleSaveItem = () => {
    if (editingItem) {
      onUpdateMenuItem(editingItem);
      setIsEditDialogOpen(false);
      setEditingItem(null);
      toast.success('Товар обновлён');
    }
  };

  const getStatusBadgeVariant = (status: Order['status']) => {
    switch (status) {
      case 'preparing':
        return 'secondary';
      case 'delivering':
        return 'default';
      case 'delivered':
        return 'outline';
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'preparing':
        return 'Готовится';
      case 'delivering':
        return 'В пути';
      case 'delivered':
        return 'Доставлен';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Админ-панель</h2>
        <Badge variant="secondary" className="text-sm px-3 py-1">
          <Icon name="Shield" size={16} className="mr-2" />
          Администратор
        </Badge>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Icon name="Package" size={18} />
            Заказы ({orders.filter(o => o.status !== 'delivered').length})
          </TabsTrigger>
          <TabsTrigger value="menu" className="flex items-center gap-2">
            <Icon name="UtensilsCrossed" size={18} />
            Меню ({menuItems.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card className="p-4 bg-primary/5">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{orders.filter(o => o.status === 'preparing').length}</p>
                <p className="text-sm text-muted-foreground">Готовится</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{orders.filter(o => o.status === 'delivering').length}</p>
                <p className="text-sm text-muted-foreground">В доставке</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{orders.filter(o => o.status === 'delivered').length}</p>
                <p className="text-sm text-muted-foreground">Доставлено</p>
              </div>
            </div>
          </Card>

          {orders.length === 0 ? (
            <Card className="p-12">
              <div className="text-center text-muted-foreground">
                <Icon name="Package" size={48} className="mx-auto mb-4 opacity-50" />
                <p>Нет заказов</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {[...orders].reverse().map((order) => (
                <Card key={order.id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-lg">Заказ №{order.id}</h3>
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center gap-2">
                          <Icon name="Calendar" size={16} className="text-muted-foreground" />
                          {order.date}
                        </p>
                        <p className="flex items-center gap-2">
                          <Icon name="MapPin" size={16} className="text-muted-foreground" />
                          {order.address}
                        </p>
                        <p className="flex items-center gap-2">
                          <Icon name="CreditCard" size={16} className="text-muted-foreground" />
                          {order.paymentMethod}
                        </p>
                      </div>
                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-semibold">Состав заказа:</p>
                        {order.items.map((item, idx) => (
                          <p key={idx} className="text-sm text-muted-foreground">
                            • {item.name} {item.selectedSize && `(${item.selectedSize})`} x{item.quantity} - {item.price * item.quantity} ₽
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <p className="text-2xl font-bold text-primary">{order.total} ₽</p>
                      {order.status !== 'delivered' && (
                        <div className="flex flex-col gap-2 w-full">
                          {order.status === 'preparing' && (
                            <Button
                              size="sm"
                              onClick={() => onUpdateOrderStatus(order.id, 'delivering')}
                              className="w-full"
                            >
                              <Icon name="Truck" size={16} className="mr-2" />
                              Отправить в доставку
                            </Button>
                          )}
                          {order.status === 'delivering' && (
                            <Button
                              size="sm"
                              onClick={() => onUpdateOrderStatus(order.id, 'delivered')}
                              className="w-full"
                            >
                              <Icon name="CheckCircle" size={16} className="mr-2" />
                              Отметить доставленным
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="menu" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {item.category === 'pizza' && 'Пицца'}
                        {item.category === 'snacks' && 'Закуски'}
                        {item.category === 'drinks' && 'Напитки'}
                        {item.category === 'combo' && 'Комбо'}
                      </Badge>
                    </div>
                    <span className="font-bold text-primary">{item.price} ₽</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                  <div className="flex gap-2">
                    <Dialog open={isEditDialogOpen && editingItem?.id === item.id} onOpenChange={(open) => {
                      setIsEditDialogOpen(open);
                      if (!open) setEditingItem(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setEditingItem(item)}
                        >
                          <Icon name="Pencil" size={14} className="mr-1" />
                          Редактировать
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Редактировать товар</DialogTitle>
                        </DialogHeader>
                        {editingItem && (
                          <div className="space-y-4 py-4">
                            <div>
                              <Label htmlFor="name">Название</Label>
                              <Input
                                id="name"
                                value={editingItem.name}
                                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="description">Описание</Label>
                              <Textarea
                                id="description"
                                value={editingItem.description}
                                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                                rows={3}
                              />
                            </div>
                            <div>
                              <Label htmlFor="price">Цена (₽)</Label>
                              <Input
                                id="price"
                                type="number"
                                value={editingItem.price}
                                onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="image">URL изображения</Label>
                              <Input
                                id="image"
                                value={editingItem.image}
                                onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="category">Категория</Label>
                              <Select
                                value={editingItem.category}
                                onValueChange={(value: any) => setEditingItem({ ...editingItem, category: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pizza">Пицца</SelectItem>
                                  <SelectItem value="snacks">Закуски</SelectItem>
                                  <SelectItem value="drinks">Напитки</SelectItem>
                                  <SelectItem value="combo">Комбо</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button onClick={handleSaveItem} className="w-full">
                              <Icon name="Save" size={16} className="mr-2" />
                              Сохранить изменения
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm('Удалить этот товар?')) {
                          onDeleteMenuItem(item.id);
                          toast.success('Товар удалён');
                        }
                      }}
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
