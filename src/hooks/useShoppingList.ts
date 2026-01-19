import { useState, useEffect } from 'react';
import type { ExtendedIngredient } from '../types/recipe';

interface ShoppingListItem extends ExtendedIngredient {
  recipeId: number;
  recipeTitle: string;
  checked: boolean;
  quantity: number;
}

export const useShoppingList = () => {
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);

  useEffect(() => {
    const storedList = localStorage.getItem('shopping-list');
    if (storedList) {
      try {
        setShoppingList(JSON.parse(storedList));
      } catch (error) {
        console.error('Error parsing shopping list from localStorage:', error);
      }
    }
  }, []);

  const saveToLocalStorage = (list: ShoppingListItem[]) => {
    localStorage.setItem('shopping-list', JSON.stringify(list));
  };

  const addIngredients = (recipeId: number, recipeTitle: string, ingredients: ExtendedIngredient[]) => {
    const newItems: ShoppingListItem[] = ingredients.map(ingredient => ({
      ...ingredient,
      recipeId,
      recipeTitle,
      checked: false,
      quantity: ingredient.amount,
    }));

    setShoppingList(prevList => {
      const updatedList = [...prevList];
      
      newItems.forEach(newItem => {
        const existingIndex = updatedList.findIndex(
          item => item.name.toLowerCase() === newItem.name.toLowerCase() && 
                 item.unit === newItem.unit
        );
        
        if (existingIndex >= 0) {
          updatedList[existingIndex].quantity += newItem.quantity;
        } else {
          updatedList.push(newItem);
        }
      });
      
      saveToLocalStorage(updatedList);
      return updatedList;
    });
  };

  const toggleItem = (index: number) => {
    setShoppingList(prevList => {
      const updatedList = [...prevList];
      updatedList[index].checked = !updatedList[index].checked;
      saveToLocalStorage(updatedList);
      return updatedList;
    });
  };

  const removeItem = (index: number) => {
    setShoppingList(prevList => {
      const updatedList = prevList.filter((_, i) => i !== index);
      saveToLocalStorage(updatedList);
      return updatedList;
    });
  };

  const clearList = () => {
    setShoppingList([]);
    localStorage.removeItem('shopping-list');
  };

  const clearChecked = () => {
    setShoppingList(prevList => {
      const updatedList = prevList.filter(item => !item.checked);
      saveToLocalStorage(updatedList);
      return updatedList;
    });
  };

  const updateQuantity = (index: number, quantity: number) => {
    setShoppingList(prevList => {
      const updatedList = [...prevList];
      updatedList[index].quantity = Math.max(0, quantity);
      saveToLocalStorage(updatedList);
      return updatedList;
    });
  };

  const getUncheckedItems = () => shoppingList.filter(item => !item.checked);
  const getCheckedItems = () => shoppingList.filter(item => item.checked);
  const getTotalItems = () => shoppingList.length;
  const getCheckedCount = () => shoppingList.filter(item => item.checked).length;

  return {
    shoppingList,
    addIngredients,
    toggleItem,
    removeItem,
    clearList,
    clearChecked,
    updateQuantity,
    getUncheckedItems,
    getCheckedItems,
    getTotalItems,
    getCheckedCount,
  };
};
