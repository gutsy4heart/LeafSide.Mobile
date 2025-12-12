import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { useAuth } from '@/providers/AuthProvider';

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * AdminRoute - компонент-обертка для защиты админских роутов
 * Проверяет наличие роли Admin у пользователя
 * Если роли нет - редиректит обратно
 */
export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { profile } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const isAdmin = profile?.roles?.includes('Admin');

  useEffect(() => {
    console.log('[AdminRoute] Checking admin access:', {
      hasProfile: Boolean(profile),
      roles: profile?.roles,
      isAdmin,
    });

    if (profile && !isAdmin) {
      console.warn('[AdminRoute] Unauthorized access attempt blocked');
      Alert.alert(
        'Access Denied',
        'Administrator privileges required to access this page.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Перенаправляем на профиль
              navigation.navigate('Tabs');
            },
          },
        ],
        { cancelable: false }
      );
    }
  }, [profile, isAdmin, navigation]);

  // Показываем детей только если пользователь админ
  if (!profile || !isAdmin) {
    return null;
  }

  return <>{children}</>;
};

