import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Minus, X, Check, Trash2, Package } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { useShoppingList } from '../hooks/useShoppingList';

export const ShoppingList = () => {
  const {
    shoppingList,
    toggleItem,
    removeItem,
    clearList,
    clearChecked,
    updateQuantity,
    getUncheckedItems,
    getCheckedItems,
    getTotalItems,
    getCheckedCount,
  } = useShoppingList();

  const uncheckedItems = getUncheckedItems();
  const checkedItems = getCheckedItems();

  if (getTotalItems() === 0) {
    return (
      <Card className="p-8 text-center">
        <Package size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Your shopping list is empty</h3>
        <p className="text-gray-500">Add ingredients from recipes to build your shopping list</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart size={24} />
              Shopping List
              <span className="bg-primary text-primary-foreground text-sm px-2 py-1 rounded-full">
                {getCheckedCount()}/{getTotalItems()}
              </span>
            </CardTitle>
            <div className="flex gap-2">
              {getCheckedCount() > 0 && (
                <Button variant="outline" size="sm" onClick={clearChecked}>
                  Clear Checked
                </Button>
              )}
              <Button variant="destructive" size="sm" onClick={clearList}>
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Unchecked Items */}
      {uncheckedItems.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">To Buy ({uncheckedItems.length})</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <AnimatePresence>
                {uncheckedItems.map((item, index) => (
                  <motion.div
                    key={`${item.name}-${item.recipeId}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleItem(shoppingList.indexOf(item))}
                      className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.recipeTitle}</div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(shoppingList.indexOf(item), item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </Button>
                      
                      <span className="w-12 text-center font-medium">
                        {item.quantity} {item.unit}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(shoppingList.indexOf(item), item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </Button>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(shoppingList.indexOf(item))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Checked Items */}
      {checkedItems.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-green-700 flex items-center gap-2">
              <Check size={20} />
              Purchased ({checkedItems.length})
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <AnimatePresence>
                {checkedItems.map((item, index) => (
                  <motion.div
                    key={`checked-${item.name}-${item.recipeId}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 bg-green-50 rounded-lg opacity-75"
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleItem(shoppingList.indexOf(item))}
                      className="w-5 h-5 rounded border-green-300 text-green-600 focus:ring-green-500"
                    />
                    
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 line-through">
                        {item.name}
                      </div>
                      <div className="text-sm text-gray-500">{item.recipeTitle}</div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      {item.quantity} {item.unit}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(shoppingList.indexOf(item))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
