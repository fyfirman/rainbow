import { omit } from 'lodash';
import React from 'react';
import { StatusBar } from 'react-native';
import createBottomSheetStackNavigator from 'react-native-cool-modals/createNativeStackNavigator';
import createNativeStackNavigator from 'react-native-screens/createNativeStackNavigator';
import { createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs-v1';
import isNativeStackAvailable from '../../helpers/isNativeStackAvailable';
import { ExchangeModalNavigator, SavingModalNavigator } from '../../navigation';
import {
  backgroundPreset,
  emojiPreset,
  expandedPreset,
  overlayExpandedPreset,
  savingsPreset,
  sheetPreset,
} from '../../navigation/transitions/effects';
import { deviceUtils } from '../../utils';
import AddCashSheet from '../AddCashSheet';
import AvatarBuilder from '../AvatarBuilder';
import ExampleScreen from '../ExampleScreen';
import ExpandedAssetScreenWithData from '../ExpandedAssetScreenWithData';
import ImportSeedPhraseSheetWithData from '../ImportSeedPhraseSheetWithData';
import ProfileScreenWithData from '../ProfileScreenWithData';
import QRScannerScreenWithData from '../QRScannerScreenWithData';
import ReceiveModal from '../ReceiveModal';
import SavingsSheet from '../SavingsSheet';
import SendSheetWithData from '../SendSheetWithData';
import SettingsModal from '../SettingsModal';
import TransactionConfirmationScreenWithData from '../TransactionConfirmationScreenWithData';
import WalletConnectConfirmationModal from '../WalletConnectConfirmationModal';
import WalletScreen from '../WalletScreen';
import WithdrawModal from '../WithdrawModal';
import {
  createStackNavigator,
  exchangePresetWithTransitions,
  expandedPresetWithTransitions,
  onTransitionEnd,
  onTransitionStart,
  sheetPresetWithTransitions,
} from './helpers';
import {
  AddCashSheetWrapper,
  appearListener,
  ImportSeedPhraseSheetWrapper,
  SendSheetWrapper,
} from './nativeStackWrappers';
import { onNavigationStateChange } from './onNavigationStateChange.ios';
import Routes from './routesNames';

const routesForSwipeStack = {
  [Routes.PROFILE_SCREEN]: ProfileScreenWithData,
  [Routes.WALLET_SCREEN]: WalletScreen,
  [Routes.QR_SCANNER_SCREEN]: QRScannerScreenWithData,
};

const SwipeStack = createMaterialTopTabNavigator(routesForSwipeStack, {
  headerMode: 'none',
  initialLayout: deviceUtils.dimensions,
  initialRouteName: Routes.WALLET_SCREEN,
  tabBarComponent: null,
});

const sendFlowRoutes = {
  [Routes.OVERLAY_EXPANDED_ASSET_SCREEN]: {
    navigationOptions: overlayExpandedPreset,
    screen: ExpandedAssetScreenWithData,
  },
  [Routes.SEND_SHEET]: {
    navigationOptions: sheetPresetWithTransitions,
    screen: SendSheetWrapper,
  },
};

const SendFlowNavigator = createStackNavigator(sendFlowRoutes, {
  initialRouteName: Routes.SEND_SHEET,
});

const routesForAddCash = {
  [Routes.ADD_CASH_SHEET]: {
    navigationOptions: sheetPresetWithTransitions,
    screen: AddCashSheetWrapper,
  },
  [Routes.OVERLAY_EXPANDED_SUPPORTED_COUNTRIES]: {
    navigationOptions: overlayExpandedPreset,
    screen: ExpandedAssetScreenWithData,
  },
};

const routesForMainNavigator = {
  [Routes.AVATAR_BUILDER]: {
    navigationOptions: emojiPreset,
    screen: AvatarBuilder,
    transparentCard: true,
  },
  [Routes.CONFIRM_REQUEST]: {
    navigationOptions: sheetPresetWithTransitions,
    screen: TransactionConfirmationScreenWithData,
  },
  [Routes.EXAMPLE_SCREEN]: {
    navigationOptions: expandedPresetWithTransitions,
    screen: ExampleScreen,
  },
  [Routes.EXCHANGE_MODAL]: {
    navigationOptions: exchangePresetWithTransitions,
    params: {
      isGestureBlocked: false,
    },
    screen: ExchangeModalNavigator,
  },
  [Routes.EXPANDED_ASSET_SCREEN]: {
    navigationOptions: expandedPreset,
    screen: ExpandedAssetScreenWithData,
  },
  [Routes.SAVINGS_SHEET]: {
    navigationOptions: savingsPreset,
    screen: SavingsSheet,
  },
  [Routes.SWIPE_LAYOUT]: {
    navigationOptions: backgroundPreset,
    screen: SwipeStack,
  },
  [Routes.WALLET_CONNECT_CONFIRMATION_MODAL]: {
    navigationOptions: expandedPresetWithTransitions,
    screen: WalletConnectConfirmationModal,
  },
  ...(isNativeStackAvailable && {
    [Routes.OVERLAY_EXPANDED_ASSET_SCREEN]: {
      navigationOptions: overlayExpandedPreset,
      screen: ExpandedAssetScreenWithData,
    },
  }),
};

const MainNavigator = createStackNavigator(routesForMainNavigator);

const routesForSavingsModals = {
  [Routes.SAVINGS_DEPOSIT_MODAL]: {
    navigationOptions: expandedPresetWithTransitions,
    params: {
      isGestureBlocked: false,
    },
    screen: SavingModalNavigator,
  },
  [Routes.SAVINGS_WITHDRAW_MODAL]: {
    navigationOptions: expandedPresetWithTransitions,
    params: {
      isGestureBlocked: false,
    },
    screen: WithdrawModal,
  },
};

const AddCashFlowNavigator = createStackNavigator(routesForAddCash, {
  initialRouteName: Routes.ADD_CASH_SHEET,
});

const routesForNativeStack = {
  [Routes.MAIN_NAVIGATOR]: MainNavigator,
  [Routes.IMPORT_SEED_PHRASE_SHEET]: ImportSeedPhraseSheetWrapper,
  ...(isNativeStackAvailable && {
    [Routes.SEND_SHEET_NAVIGATOR]: SendFlowNavigator,
    [Routes.ADD_CASH_SCREEN_NAVIGATOR]: AddCashFlowNavigator,
  }),
};

const NativeStack = createNativeStackNavigator(routesForNativeStack, {
  defaultNavigationOptions: {
    onAppear: () => appearListener.current && appearListener.current(),
  },
  headerMode: 'none',
  initialRouteName: Routes.MAIN_NAVIGATOR,
  mode: 'modal',
});

const routesForNativeStackWrapper = {
  [Routes.NATIVE_STACK]: NativeStack,
  ...routesForSavingsModals,
};

const NativeStackWrapper = createStackNavigator(routesForNativeStackWrapper, {
  initialRouteName: Routes.NATIVE_STACK,
});

const routesForNativeStackFallback = {
  [Routes.ADD_CASH_SHEET]: {
    navigationOptions: sheetPresetWithTransitions,
    screen: AddCashSheet,
  },
  [Routes.IMPORT_SEED_PHRASE_SHEET]: {
    navigationOptions: {
      ...sheetPreset,
      onTransitionStart: () => {
        StatusBar.setBarStyle('light-content');
      },
    },
    screen: ImportSeedPhraseSheetWithData,
  },
  [Routes.MAIN_NAVIGATOR]: MainNavigator,
  [Routes.OVERLAY_EXPANDED_ASSET_SCREEN]: {
    navigationOptions: overlayExpandedPreset,
    screen: ExpandedAssetScreenWithData,
  },
  [Routes.OVERLAY_EXPANDED_SUPPORTED_COUNTRIES]: {
    navigationOptions: overlayExpandedPreset,
    screen: ExpandedAssetScreenWithData,
  },
  [Routes.SEND_SHEET]: {
    navigationOptions: {
      ...omit(sheetPreset, 'gestureResponseDistance'),
      onTransitionStart: () => {
        StatusBar.setBarStyle('light-content');
        onTransitionStart();
      },
    },
    screen: SendSheetWithData,
  },
  ...routesForSavingsModals,
};

const NativeStackFallback = createStackNavigator(routesForNativeStackFallback, {
  defaultNavigationOptions: {
    onTransitionEnd,
    onTransitionStart,
  },
  headerMode: 'none',
  initialRouteName: Routes.MAIN_NAVIGATOR,
  mode: 'modal',
});

const Stack = isNativeStackAvailable ? NativeStackWrapper : NativeStackFallback;

const routesForBottomSheetStack = {
  [Routes.STACK]: Stack,
  [Routes.RECEIVE_MODAL]: ReceiveModal,
  [Routes.SETTINGS_MODAL]: SettingsModal,
};

const MainNativeBottomSheetNavigation = createBottomSheetStackNavigator(
  routesForBottomSheetStack,
  {
    defaultNavigationOptions: {
      customStack: true,
      onWillDismiss: () => {
        sheetPreset.onTransitionStart({ closing: true });
      },
      showDragIndicator: false,
      springDamping: 0.8,
      transitionDuration: 0.35,
    },
    mode: 'modal',
  }
);

const AppContainer = createAppContainer(MainNativeBottomSheetNavigation);

const AppContainerWithAnalytics = React.forwardRef((props, ref) => (
  <AppContainer ref={ref} onNavigationStateChange={onNavigationStateChange} />
));

AppContainerWithAnalytics.displayName = 'AppContainerWithAnalytics';

export default React.memo(AppContainerWithAnalytics);
