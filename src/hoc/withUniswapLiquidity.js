import {
  compact,
  floor,
  get,
  isEmpty,
  map,
  orderBy,
  values,
} from 'lodash';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { createSelector } from 'reselect';
import {
  convertAmountToBigNumber,
  divide,
  multiply,
  simpleConvertAmountToDisplay,
} from '../helpers/utilities';
import { ethereumUtils, removeCurrencySymbols } from '../utils';
import withAccountSettings from './withAccountSettings';

const mapStateToProps = ({
  settings: { nativeCurrency },
  uniswap: { uniswap },
}) => ({
  nativeCurrency,
  uniswap,
});

const assetsSelector = state => state.assets;
const nativeCurrencySelector = state => state.nativeCurrency;
const nativeCurrencySymbolSelector = state => state.nativeCurrencySymbol;
const uniswapSelector = state => state.uniswap;

export const transformPool = (liquidityPool, ethPrice, nativeCurrency) => {
  if (isEmpty(liquidityPool)) {
    return null;
  }

  const {
    balance,
    ethBalance,
    token: {
      balance: tokenBalance,
      name: tokenName,
      symbol: tokenSymbol,
    },
    totalSupply,
    uniqueId,
  } = liquidityPool;

  const percentageOwned = multiply(divide(balance, totalSupply), 100);
  const balanceRaw = multiply(ethBalance, ethPrice);
  const balanceAmount = convertAmountToBigNumber(balanceRaw);
  const totalBalanceAmount = multiply(balanceAmount, 2);

  const nativeDisplay = simpleConvertAmountToDisplay(
    balanceAmount,
    nativeCurrency,
  );

  const totalNativeDisplay = simpleConvertAmountToDisplay(
    totalBalanceAmount,
    nativeCurrency,
  );

  // TODO: perhaps for future, may want to include an investment type enum
  return {
    ethBalance: floor(parseFloat(ethBalance), 4) || '< 0.0001',
    nativeDisplay,
    percentageOwned,
    tokenBalance: floor(parseFloat(tokenBalance), 4) || '< 0.0001',
    tokenName,
    tokenSymbol,
    totalBalanceAmount,
    totalNativeDisplay,
    uniqueId,
  };
};

const buildUniswapCards = (nativeCurrency, nativeCurrencySymbol, assets, uniswap) => {
  const ethPrice = get(ethereumUtils.getAsset(assets), 'price.value', 0);

  const uniswapPools = compact(map(values(uniswap), (liquidityPool) => transformPool(liquidityPool, ethPrice, nativeCurrency)));
  const orderedUniswapPools = orderBy(uniswapPools, ['totalNativeDisplay'], ['desc']);

  let uniswapTotal = 0;

  if (Array.isArray(orderedUniswapPools) && orderedUniswapPools.length) {
    uniswapTotal = orderedUniswapPools
      .map(({ totalNativeDisplay }) => removeCurrencySymbols(totalNativeDisplay))
      .reduce((a, b) => (a + b), 0);
  }

  return {
    uniswap: orderedUniswapPools,
    uniswapTotal: `${nativeCurrencySymbol}${uniswapTotal.toFixed(2)}`,
  };
};

export const readableUniswapSelector = createSelector(
  [
    nativeCurrencySelector,
    nativeCurrencySymbolSelector,
    assetsSelector,
    uniswapSelector,
  ],
  buildUniswapCards,
);

export default Component => compose(
  withAccountSettings,
  connect(mapStateToProps),
  withProps(readableUniswapSelector),
)(Component);
