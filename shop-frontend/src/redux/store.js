import { configureStore, combineReducers } from '@reduxjs/toolkit'
import authReducer from './authSlice.js'
import cartReducer from './cartSlice.js'
import { persistStore, persistReducer } from 'redux-persist'

// 1. XÓA BỎ DÒNG IMPORT NÀY:
// import storage from 'redux-persist/lib/storage'; 

// 2. TỰ TẠO MỘT CUSTOM STORAGE VÀO ĐÂY ĐỂ VƯỢT MẶT LỖI CỦA THƯ VIỆN:
const customStorage = {
    getItem: (key) => {
        return Promise.resolve(localStorage.getItem(key));
    },
    setItem: (key, value) => {
        localStorage.setItem(key, value);
        return Promise.resolve(value);
    },
    removeItem: (key) => {
        localStorage.removeItem(key);
        return Promise.resolve();
    },
};

const rootReducer = combineReducers({
    auth: authReducer,
    cart: cartReducer
});

const persistConfig = {
    key: 'minhnhut-shop-root',
    storage: customStorage, // 3. Truyền cái cục custom vừa tạo vào đây
    whitelist: ['auth', 'cart']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);