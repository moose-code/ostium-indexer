/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  OstiumPairsInfos,
  OstiumPairsInfos_AccFundingFeesStored,
  OstiumPairsInfos_AccFundingFeesStoredV2,
  OstiumPairsInfos_AccRolloverFeesStored,
  OstiumPairsInfos_FeesCharged,
  OstiumPairsInfos_FundingFeeSlopeUpdated,
  OstiumPairsInfos_HillParamsUpdated,
  OstiumPairsInfos_Initialized,
  OstiumPairsInfos_LastVelocityUpdated,
  OstiumPairsInfos_LiqMarginThresholdPUpdated,
  OstiumPairsInfos_LiqThresholdPUpdated,
  OstiumPairsInfos_ManagerUpdated,
  OstiumPairsInfos_MaxFundingFeePerBlockUpdated,
  OstiumPairsInfos_MaxFundingFeeVelocityUpdated,
  OstiumPairsInfos_MaxNegativePnlOnOpenPUpdated,
  OstiumPairsInfos_MaxRolloverFeePerBlockUpdated,
  OstiumPairsInfos_MaxRolloverFeeSlopeUpdated,
  OstiumPairsInfos_MaxRolloverVolatilityUpdated,
  OstiumPairsInfos_PairFundingFeesUpdated,
  OstiumPairsInfos_PairFundingFeesUpdatedV2,
  OstiumPairsInfos_PairOpeningFeesUpdated,
  OstiumPairsInfos_PairRolloverFeesUpdated,
  OstiumPairsInfos_RolloverFeePerBlockUpdated,
  OstiumPairsInfos_TradeInitialAccFeesStored,
  OstiumPairsInfos_VaultFeePercentUpdated,
  OstiumPairsStorage,
  OstiumPairsStorage_PairAdded,
  OstiumPairsStorage_PairUpdated,
  OstiumPairsStorage_GroupUpdated,
  OstiumPairsStorage_FeeUpdated,
  OstiumPairsStorage_PairMaxLeverageUpdated,
  OstiumPairsStorage_PairOvernightMaxLeverageUpdated,
  OstiumTrading,
  OstiumTrading_MarketOpenOrderInitiated,
  OstiumTrading_MarketCloseOrderInitiated,
  OstiumTrading_MarketCloseOrderInitiatedV2,
  OstiumTrading_OpenLimitCanceled,
  OstiumTrading_OpenLimitPlaced,
  OstiumTrading_AutomationOpenOrderInitiated,
  OstiumTrading_AutomationCloseOrderInitiated,
  OstiumTrading_OpenLimitUpdated,
  OstiumTrading_SlUpdated,
  OstiumTrading_TpUpdated,
  OstiumTrading_MarketOpenTimeoutExecuted,
  OstiumTrading_MarketOpenTimeoutExecutedV2,
  OstiumTrading_MarketCloseTimeoutExecuted,
  OstiumTrading_MarketCloseTimeoutExecutedV2,
  OstiumTrading_TopUpCollateralExecuted,
  OstiumTrading_RemoveCollateralInitiated,
  OstiumTrading_Paused,
  OstiumTrading_MarketOrdersTimeoutUpdated,
  OstiumTrading_MaxAllowedCollateralUpdated,
  OstiumTradingCallbacks,
  OstiumTradingCallbacks_MarketOpenExecuted,
  OstiumTradingCallbacks_MarketCloseExecuted,
  OstiumTradingCallbacks_MarketCloseExecutedV2,
  OstiumTradingCallbacks_LimitOpenExecuted,
  OstiumTradingCallbacks_LimitCloseExecuted,
  OstiumTradingCallbacks_MarketOpenCanceled,
  OstiumTradingCallbacks_MarketCloseCanceled,
  OstiumTradingCallbacks_AutomationCloseOrderCanceled,
  OstiumTradingCallbacks_AutomationOpenOrderCanceled,
  OstiumTradingCallbacks_DevFeeCharged,
  OstiumTradingCallbacks_VaultOpeningFeeCharged,
  OstiumTradingCallbacks_VaultLiqFeeCharged,
  OstiumTradingCallbacks_OracleFeeCharged,
  OstiumTradingCallbacks_RemoveCollateralExecuted,
  OstiumTradingCallbacks_RemoveCollateralRejected,
  OstiumTradingCallbacks_FeesCharged,
  OstiumTradingCallbacks_Paused,
  OstiumVault,
  OstiumVault_Deposit,
  OstiumVault_Withdraw,
  OstiumVault_WithdrawRequested,
  OstiumVault_WithdrawCanceled,
  OstiumVault_DepositLocked,
  OstiumVault_DepositUnlocked,
  OstiumVault_AccPnlPerTokenUsedUpdated,
  OstiumVault_ShareToAssetsPriceUpdated,
  OstiumVault_RewardDistributed,
  OstiumVault_MaxDiscountPUpdated,
  OstiumVault_MaxDiscountThresholdPUpdated,
  OstiumVault_CurrentMaxSupplyUpdated,
  OstiumVault_Transfer,
  OstiumVault_Approval,
  OstiumLockedDepositNft,
  OstiumLockedDepositNft_Transfer,
  OstiumTradingStorage,
  OstiumTradingStorage_MaxOpenInterestUpdated,
  OstiumTradingStorage_MaxTradesPerPairUpdated,
  OstiumTradingStorage_MaxPendingMarketOrdersUpdated,
  OstiumOpenPnl,
  OstiumOpenPnl_LastTradePriceUpdated,
} from "generated";

OstiumPairsInfos.AccFundingFeesStored.handler(async ({ event, context }) => {
  const entity: OstiumPairsInfos_AccFundingFeesStored = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    pairIndex: event.params.pairIndex,
    valueLong: event.params.valueLong,
    valueShort: event.params.valueShort,
    lastFundingRate: event.params.lastFundingRate,
    velocity: event.params.velocity,
  };

  context.OstiumPairsInfos_AccFundingFeesStored.set(entity);
});

OstiumPairsInfos.AccFundingFeesStoredV2.handler(async ({ event, context }) => {
  const entity: OstiumPairsInfos_AccFundingFeesStoredV2 = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    pairIndex: event.params.pairIndex,
    valueLong: event.params.valueLong,
    valueShort: event.params.valueShort,
    lastOiDelta: event.params.lastOiDelta,
    lastFundingRate: event.params.lastFundingRate,
  };

  context.OstiumPairsInfos_AccFundingFeesStoredV2.set(entity);
});

OstiumPairsInfos.AccRolloverFeesStored.handler(async ({ event, context }) => {
  const entity: OstiumPairsInfos_AccRolloverFeesStored = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    pairIndex: event.params.pairIndex,
    value: event.params.value,
  };

  context.OstiumPairsInfos_AccRolloverFeesStored.set(entity);
});

OstiumPairsInfos.FeesCharged.handler(async ({ event, context }) => {
  const entity: OstiumPairsInfos_FeesCharged = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    orderId: event.params.orderId,
    tradeId: event.params.tradeId,
    trader: event.params.trader,
    rolloverFees: event.params.rolloverFees,
    fundingFees: event.params.fundingFees,
  };

  context.OstiumPairsInfos_FeesCharged.set(entity);
});

OstiumPairsInfos.FundingFeeSlopeUpdated.handler(async ({ event, context }) => {
  const entity: OstiumPairsInfos_FundingFeeSlopeUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    pairIndex: event.params.pairIndex,
    value: event.params.value,
  };

  context.OstiumPairsInfos_FundingFeeSlopeUpdated.set(entity);
});

OstiumPairsInfos.HillParamsUpdated.handler(async ({ event, context }) => {
  const entity: OstiumPairsInfos_HillParamsUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    pairIndex: event.params.pairIndex,
    hillInflectionPoint: event.params.hillInflectionPoint,
    hillPosScale: event.params.hillPosScale,
    hillNegScale: event.params.hillNegScale,
  };

  context.OstiumPairsInfos_HillParamsUpdated.set(entity);
});

OstiumPairsInfos.Initialized.handler(async ({ event, context }) => {
  const entity: OstiumPairsInfos_Initialized = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    version: event.params.version,
  };

  context.OstiumPairsInfos_Initialized.set(entity);
});

OstiumPairsInfos.LastVelocityUpdated.handler(async ({ event, context }) => {
  const entity: OstiumPairsInfos_LastVelocityUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    pairIndex: event.params.pairIndex,
    value: event.params.value,
  };

  context.OstiumPairsInfos_LastVelocityUpdated.set(entity);
});

OstiumPairsInfos.LiqMarginThresholdPUpdated.handler(
  async ({ event, context }) => {
    const entity: OstiumPairsInfos_LiqMarginThresholdPUpdated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      value: event.params.value,
    };

    context.OstiumPairsInfos_LiqMarginThresholdPUpdated.set(entity);
  }
);

OstiumPairsInfos.LiqThresholdPUpdated.handler(async ({ event, context }) => {
  const entity: OstiumPairsInfos_LiqThresholdPUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    value: event.params.value,
  };

  context.OstiumPairsInfos_LiqThresholdPUpdated.set(entity);
});

OstiumPairsInfos.ManagerUpdated.handler(async ({ event, context }) => {
  const entity: OstiumPairsInfos_ManagerUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    value: event.params.value,
  };

  context.OstiumPairsInfos_ManagerUpdated.set(entity);
});

OstiumPairsInfos.MaxFundingFeePerBlockUpdated.handler(
  async ({ event, context }) => {
    const entity: OstiumPairsInfos_MaxFundingFeePerBlockUpdated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      pairIndex: event.params.pairIndex,
      value: event.params.value,
    };

    context.OstiumPairsInfos_MaxFundingFeePerBlockUpdated.set(entity);
  }
);

OstiumPairsInfos.MaxFundingFeeVelocityUpdated.handler(
  async ({ event, context }) => {
    const entity: OstiumPairsInfos_MaxFundingFeeVelocityUpdated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      pairIndex: event.params.pairIndex,
      value: event.params.value,
    };

    context.OstiumPairsInfos_MaxFundingFeeVelocityUpdated.set(entity);
  }
);

OstiumPairsInfos.MaxNegativePnlOnOpenPUpdated.handler(
  async ({ event, context }) => {
    const entity: OstiumPairsInfos_MaxNegativePnlOnOpenPUpdated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      value: event.params.value,
    };

    context.OstiumPairsInfos_MaxNegativePnlOnOpenPUpdated.set(entity);
  }
);

OstiumPairsInfos.MaxRolloverFeePerBlockUpdated.handler(
  async ({ event, context }) => {
    const entity: OstiumPairsInfos_MaxRolloverFeePerBlockUpdated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      pairIndex: event.params.pairIndex,
      value: event.params.value,
    };

    context.OstiumPairsInfos_MaxRolloverFeePerBlockUpdated.set(entity);
  }
);

OstiumPairsInfos.MaxRolloverFeeSlopeUpdated.handler(
  async ({ event, context }) => {
    const entity: OstiumPairsInfos_MaxRolloverFeeSlopeUpdated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      pairIndex: event.params.pairIndex,
      value: event.params.value,
    };

    context.OstiumPairsInfos_MaxRolloverFeeSlopeUpdated.set(entity);
  }
);

OstiumPairsInfos.MaxRolloverVolatilityUpdated.handler(
  async ({ event, context }) => {
    const entity: OstiumPairsInfos_MaxRolloverVolatilityUpdated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      pairIndex: event.params.pairIndex,
      value: event.params.value,
    };

    context.OstiumPairsInfos_MaxRolloverVolatilityUpdated.set(entity);
  }
);

OstiumPairsInfos.PairFundingFeesUpdated.handler(async ({ event, context }) => {
  const entity: OstiumPairsInfos_PairFundingFeesUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    pairIndex: event.params.pairIndex,
    value_0: event.params.value[0],
    value_1: event.params.value[1],
    value_2: event.params.value[2],
    value_3: event.params.value[3],
    value_4: event.params.value[4],
    value_5: event.params.value[5],
    value_6: event.params.value[6],
    value_7: event.params.value[7],
  };

  context.OstiumPairsInfos_PairFundingFeesUpdated.set(entity);
});

OstiumPairsInfos.PairFundingFeesUpdatedV2.handler(
  async ({ event, context }) => {
    const entity: OstiumPairsInfos_PairFundingFeesUpdatedV2 = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      pairIndex: event.params.pairIndex,
      value_0: event.params.value[0],
      value_1: event.params.value[1],
      value_2: event.params.value[2],
      value_3: event.params.value[3],
      value_4: event.params.value[4],
      value_5: event.params.value[5],
      value_6: event.params.value[6],
      value_7: event.params.value[7],
      value_8: event.params.value[8],
      value_9: event.params.value[9],
      value_10: event.params.value[10],
      value_11: event.params.value[11],
    };

    context.OstiumPairsInfos_PairFundingFeesUpdatedV2.set(entity);
  }
);

OstiumPairsInfos.PairOpeningFeesUpdated.handler(async ({ event, context }) => {
  const entity: OstiumPairsInfos_PairOpeningFeesUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    pairIndex: event.params.pairIndex,
    value_0: event.params.value[0],
    value_1: event.params.value[1],
    value_2: event.params.value[2],
    value_3: event.params.value[3],
    value_4: event.params.value[4],
    value_5: event.params.value[5],
  };

  context.OstiumPairsInfos_PairOpeningFeesUpdated.set(entity);
});

OstiumPairsInfos.PairRolloverFeesUpdated.handler(async ({ event, context }) => {
  const entity: OstiumPairsInfos_PairRolloverFeesUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    pairIndex: event.params.pairIndex,
    value_0: event.params.value[0],
    value_1: event.params.value[1],
    value_2: event.params.value[2],
    value_3: event.params.value[3],
    value_4: event.params.value[4],
    value_5: event.params.value[5],
  };

  context.OstiumPairsInfos_PairRolloverFeesUpdated.set(entity);
});

OstiumPairsInfos.RolloverFeePerBlockUpdated.handler(
  async ({ event, context }) => {
    const entity: OstiumPairsInfos_RolloverFeePerBlockUpdated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      pairIndex: event.params.pairIndex,
      value: event.params.value,
      volatility: event.params.volatility,
    };

    context.OstiumPairsInfos_RolloverFeePerBlockUpdated.set(entity);
  }
);

OstiumPairsInfos.TradeInitialAccFeesStored.handler(
  async ({ event, context }) => {
    const entity: OstiumPairsInfos_TradeInitialAccFeesStored = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      tradeId: event.params.tradeId,
      trader: event.params.trader,
      pairIndex: event.params.pairIndex,
      index: event.params.index,
      rollover: event.params.rollover,
      funding: event.params.funding,
    };

    context.OstiumPairsInfos_TradeInitialAccFeesStored.set(entity);
  }
);

OstiumPairsInfos.VaultFeePercentUpdated.handler(async ({ event, context }) => {
  const entity: OstiumPairsInfos_VaultFeePercentUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    pairIndex: event.params.pairIndex,
    value: event.params.value,
  };

  context.OstiumPairsInfos_VaultFeePercentUpdated.set(entity);
});

// OstiumPairsStorage
OstiumPairsStorage.PairAdded.handler(async ({ event, context }) => {
  const entity: OstiumPairsStorage_PairAdded = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    index: event.params.index,
    from: event.params.from,
    to: event.params.to,
  };
  context.OstiumPairsStorage_PairAdded.set(entity);
});

OstiumPairsStorage.PairUpdated.handler(async ({ event, context }) => {
  const entity: OstiumPairsStorage_PairUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    pairIndex: event.params.index,
  };
  context.OstiumPairsStorage_PairUpdated.set(entity);
});

OstiumPairsStorage.GroupUpdated.handler(async ({ event, context }) => {
  const entity: OstiumPairsStorage_GroupUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    index: event.params.index,
  };
  context.OstiumPairsStorage_GroupUpdated.set(entity);
});

OstiumPairsStorage.FeeUpdated.handler(async ({ event, context }) => {
  const entity: OstiumPairsStorage_FeeUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    index: event.params.index,
  };
  context.OstiumPairsStorage_FeeUpdated.set(entity);
});

OstiumPairsStorage.PairMaxLeverageUpdated.handler(
  async ({ event, context }) => {
    const entity: OstiumPairsStorage_PairMaxLeverageUpdated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      pairIndex: event.params.pairIndex,
      maxLeverage: event.params.maxLeverage,
    };
    context.OstiumPairsStorage_PairMaxLeverageUpdated.set(entity);
  }
);

OstiumPairsStorage.PairOvernightMaxLeverageUpdated.handler(
  async ({ event, context }) => {
    const entity: OstiumPairsStorage_PairOvernightMaxLeverageUpdated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      pairIndex: event.params.pairIndex,
      overnightMaxLeverage: event.params.overnightMaxLeverage,
    };
    context.OstiumPairsStorage_PairOvernightMaxLeverageUpdated.set(entity);
  }
);

// OstiumTrading
OstiumTrading.MarketOpenOrderInitiated.handler(async ({ event, context }) => {
  const entity: OstiumTrading_MarketOpenOrderInitiated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    orderId: event.params.orderId,
    trader: event.params.trader,
    pairIndex: event.params.pairIndex,
  };
  context.OstiumTrading_MarketOpenOrderInitiated.set(entity);
});

OstiumTrading.MarketCloseOrderInitiated.handler(async ({ event, context }) => {
  const entity: OstiumTrading_MarketCloseOrderInitiated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    orderId: event.params.orderId,
    tradeId: event.params.tradeId,
    trader: event.params.trader,
    pairIndex: event.params.pairIndex,
  };
  context.OstiumTrading_MarketCloseOrderInitiated.set(entity);
});

OstiumTrading.MarketCloseOrderInitiatedV2.handler(
  async ({ event, context }) => {
    const entity: OstiumTrading_MarketCloseOrderInitiatedV2 = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      orderId: event.params.orderId,
      tradeId: event.params.tradeId,
      trader: event.params.trader,
      pairIndex: event.params.pairIndex,
      closePercentage: event.params.closePercentage,
    };
    context.OstiumTrading_MarketCloseOrderInitiatedV2.set(entity);
  }
);

OstiumTrading.OpenLimitCanceled.handler(async ({ event, context }) => {
  const entity: OstiumTrading_OpenLimitCanceled = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    trader: event.params.trader,
    pairIndex: event.params.pairIndex,
    index: event.params.index,
  };
  context.OstiumTrading_OpenLimitCanceled.set(entity);
});

OstiumTrading.OpenLimitPlaced.handler(async ({ event, context }) => {
  const entity: OstiumTrading_OpenLimitPlaced = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    trader: event.params.trader,
    pairIndex: event.params.pairIndex,
    index: event.params.index,
  };
  context.OstiumTrading_OpenLimitPlaced.set(entity);
});

OstiumTrading.AutomationOpenOrderInitiated.handler(
  async ({ event, context }) => {
    const entity: OstiumTrading_AutomationOpenOrderInitiated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      orderId: event.params.orderId,
      trader: event.params.trader,
      pairIndex: event.params.pairIndex,
      index: event.params.index,
    };
    context.OstiumTrading_AutomationOpenOrderInitiated.set(entity);
  }
);

OstiumTrading.AutomationCloseOrderInitiated.handler(
  async ({ event, context }) => {
    const entity: OstiumTrading_AutomationCloseOrderInitiated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      orderId: event.params.orderId,
      tradeId: event.params.tradeId,
      trader: event.params.trader,
      pairIndex: event.params.pairIndex,
      index: event.params.index,
    };
    context.OstiumTrading_AutomationCloseOrderInitiated.set(entity);
  }
);

OstiumTrading.OpenLimitUpdated.handler(async ({ event, context }) => {
  const entity: OstiumTrading_OpenLimitUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    trader: event.params.trader,
    pairIndex: event.params.pairIndex,
    index: event.params.index,
    newPrice: event.params.newPrice,
    newTp: event.params.newTp,
    newSl: event.params.newSl,
  };
  context.OstiumTrading_OpenLimitUpdated.set(entity);
});

OstiumTrading.SlUpdated.handler(async ({ event, context }) => {
  const entity: OstiumTrading_SlUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    tradeId: event.params.tradeId,
    trader: event.params.trader,
    pairIndex: event.params.pairIndex,
    index: event.params.index,
    newSl: event.params.newSl,
  };
  context.OstiumTrading_SlUpdated.set(entity);
});

OstiumTrading.TpUpdated.handler(async ({ event, context }) => {
  const entity: OstiumTrading_TpUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    tradeId: event.params.tradeId,
    trader: event.params.trader,
    pairIndex: event.params.pairIndex,
    index: event.params.index,
    newTp: event.params.newTp,
  };
  context.OstiumTrading_TpUpdated.set(entity);
});

OstiumTrading.MarketOpenTimeoutExecuted.handler(async ({ event, context }) => {
  const o = event.params._1;
  const t = o[3];
  const entity: OstiumTrading_MarketOpenTimeoutExecuted = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    orderId: event.params.orderId,
    order_0: o[0],
    order_1: o[1],
    order_2: o[2],
    order_3_0: t[0],
    order_3_1: t[1],
    order_3_2: t[2],
    order_3_3: t[3],
    order_3_4: t[4],
    order_3_5: t[5],
    order_3_6: t[6],
    order_3_7: t[7],
    order_3_8: t[8],
  };
  context.OstiumTrading_MarketOpenTimeoutExecuted.set(entity);
});

OstiumTrading.MarketOpenTimeoutExecutedV2.handler(
  async ({ event, context }) => {
    const o = event.params._1;
    const t = o[3];
    const entity: OstiumTrading_MarketOpenTimeoutExecutedV2 = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      orderId: event.params.orderId,
      order_0: o[0],
      order_1: o[1],
      order_2: o[2],
      order_3_0: t[0],
      order_3_1: t[1],
      order_3_2: t[2],
      order_3_3: t[3],
      order_3_4: t[4],
      order_3_5: t[5],
      order_3_6: t[6],
      order_3_7: t[7],
      order_3_8: t[8],
      order_4: o[4],
    };
    context.OstiumTrading_MarketOpenTimeoutExecutedV2.set(entity);
  }
);

OstiumTrading.MarketCloseTimeoutExecuted.handler(async ({ event, context }) => {
  const o = event.params._2;
  const t = o[3];
  const entity: OstiumTrading_MarketCloseTimeoutExecuted = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    orderId: event.params.orderId,
    tradeId: event.params.tradeId,
    order_0: o[0],
    order_1: o[1],
    order_2: o[2],
    order_3_0: t[0],
    order_3_1: t[1],
    order_3_2: t[2],
    order_3_3: t[3],
    order_3_4: t[4],
    order_3_5: t[5],
    order_3_6: t[6],
    order_3_7: t[7],
    order_3_8: t[8],
  };
  context.OstiumTrading_MarketCloseTimeoutExecuted.set(entity);
});

OstiumTrading.MarketCloseTimeoutExecutedV2.handler(
  async ({ event, context }) => {
    const o = event.params._2;
    const t = o[3];
    const entity: OstiumTrading_MarketCloseTimeoutExecutedV2 = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      orderId: event.params.orderId,
      tradeId: event.params.tradeId,
      order_0: o[0],
      order_1: o[1],
      order_2: o[2],
      order_3_0: t[0],
      order_3_1: t[1],
      order_3_2: t[2],
      order_3_3: t[3],
      order_3_4: t[4],
      order_3_5: t[5],
      order_3_6: t[6],
      order_3_7: t[7],
      order_3_8: t[8],
      order_4: o[4],
    };
    context.OstiumTrading_MarketCloseTimeoutExecutedV2.set(entity);
  }
);

OstiumTrading.TopUpCollateralExecuted.handler(async ({ event, context }) => {
  const entity: OstiumTrading_TopUpCollateralExecuted = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    tradeId: event.params.tradeId,
    trader: event.params.trader,
    pairIndex: event.params.pairIndex,
    topUpAmount: event.params.topUpAmount,
    newLeverage: event.params.newLeverage,
  };
  context.OstiumTrading_TopUpCollateralExecuted.set(entity);
});

OstiumTrading.RemoveCollateralInitiated.handler(async ({ event, context }) => {
  const entity: OstiumTrading_RemoveCollateralInitiated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    tradeId: event.params.tradeId,
    orderId: event.params.orderId,
    trader: event.params.trader,
    pairIndex: event.params.pairIndex,
    removeAmount: event.params.removeAmount,
  };
  context.OstiumTrading_RemoveCollateralInitiated.set(entity);
});

OstiumTrading.Paused.handler(async ({ event, context }) => {
  const entity: OstiumTrading_Paused = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    paused: event.params.paused,
  };
  context.OstiumTrading_Paused.set(entity);
});

OstiumTrading.MarketOrdersTimeoutUpdated.handler(async ({ event, context }) => {
  const entity: OstiumTrading_MarketOrdersTimeoutUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    value: event.params.value,
  };
  context.OstiumTrading_MarketOrdersTimeoutUpdated.set(entity);
});

OstiumTrading.MaxAllowedCollateralUpdated.handler(
  async ({ event, context }) => {
    const entity: OstiumTrading_MaxAllowedCollateralUpdated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      value: event.params.value,
    };
    context.OstiumTrading_MaxAllowedCollateralUpdated.set(entity);
  }
);

// OstiumTradingCallbacks
OstiumTradingCallbacks.MarketOpenExecuted.handler(
  async ({ event, context }) => {
    const t = event.params._1;
    const entity: OstiumTradingCallbacks_MarketOpenExecuted = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      orderId: event.params.orderId,
      t_0: t[0],
      t_1: t[1],
      t_2: t[2],
      t_3: t[3],
      t_4: t[4],
      t_5: t[5],
      t_6: t[6],
      t_7: t[7],
      t_8: t[8],
      priceImpactP: event.params.priceImpactP,
      tradeNotional: event.params.tradeNotional,
    };
    context.OstiumTradingCallbacks_MarketOpenExecuted.set(entity);
  }
);

OstiumTradingCallbacks.MarketCloseExecuted.handler(
  async ({ event, context }) => {
    const entity: OstiumTradingCallbacks_MarketCloseExecuted = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      orderId: event.params.orderId,
      tradeId: event.params.tradeId,
      price: event.params.price,
      priceImpactP: event.params.priceImpactP,
      percentProfit: event.params.percentProfit,
      usdcSentToTrader: event.params.usdcSentToTrader,
    };
    context.OstiumTradingCallbacks_MarketCloseExecuted.set(entity);
  }
);

OstiumTradingCallbacks.MarketCloseExecutedV2.handler(
  async ({ event, context }) => {
    const entity: OstiumTradingCallbacks_MarketCloseExecutedV2 = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      orderId: event.params.orderId,
      tradeId: event.params.tradeId,
      price: event.params.price,
      priceImpactP: event.params.priceImpactP,
      percentProfit: event.params.percentProfit,
      usdcSentToTrader: event.params.usdcSentToTrader,
      percentageClosed: event.params.percentageClosed,
    };
    context.OstiumTradingCallbacks_MarketCloseExecutedV2.set(entity);
  }
);

OstiumTradingCallbacks.LimitOpenExecuted.handler(async ({ event, context }) => {
  const t = event.params._2;
  const entity: OstiumTradingCallbacks_LimitOpenExecuted = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    orderId: event.params.orderId,
    limitIndex: event.params.limitIndex,
    t_0: t[0],
    t_1: t[1],
    t_2: t[2],
    t_3: t[3],
    t_4: t[4],
    t_5: t[5],
    t_6: t[6],
    t_7: t[7],
    t_8: t[8],
    priceImpactP: event.params.priceImpactP,
    tradeNotional: event.params.tradeNotional,
  };
  context.OstiumTradingCallbacks_LimitOpenExecuted.set(entity);
});

OstiumTradingCallbacks.LimitCloseExecuted.handler(
  async ({ event, context }) => {
    const entity: OstiumTradingCallbacks_LimitCloseExecuted = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      orderId: event.params.orderId,
      tradeId: event.params.tradeId,
      index: event.params.index,
      price: event.params.price,
      priceImpactP: event.params.priceImpactP,
      percentProfit: event.params.percentProfit,
      usdcSentToTrader: event.params.usdcSentToTrader,
    };
    context.OstiumTradingCallbacks_LimitCloseExecuted.set(entity);
  }
);

OstiumTradingCallbacks.MarketOpenCanceled.handler(
  async ({ event, context }) => {
    const entity: OstiumTradingCallbacks_MarketOpenCanceled = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      orderId: event.params.orderId,
      trader: event.params.trader,
      pairIndex: event.params.pairIndex,
      cancelReason: event.params.cancelReason,
    };
    context.OstiumTradingCallbacks_MarketOpenCanceled.set(entity);
  }
);

OstiumTradingCallbacks.MarketCloseCanceled.handler(
  async ({ event, context }) => {
    const entity: OstiumTradingCallbacks_MarketCloseCanceled = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      orderId: event.params.orderId,
      tradeId: event.params.tradeId,
      trader: event.params.trader,
      pairIndex: event.params.pairIndex,
      index: event.params.index,
      cancelReason: event.params.cancelReason,
    };
    context.OstiumTradingCallbacks_MarketCloseCanceled.set(entity);
  }
);

OstiumTradingCallbacks.AutomationCloseOrderCanceled.handler(
  async ({ event, context }) => {
    const entity: OstiumTradingCallbacks_AutomationCloseOrderCanceled = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      orderId: event.params.orderId,
      tradeId: event.params.tradeId,
      trader: event.params.trader,
      pairIndex: event.params.pairIndex,
      index: event.params.index,
      cancelReason: event.params.cancelReason,
    };
    context.OstiumTradingCallbacks_AutomationCloseOrderCanceled.set(entity);
  }
);

OstiumTradingCallbacks.AutomationOpenOrderCanceled.handler(
  async ({ event, context }) => {
    const entity: OstiumTradingCallbacks_AutomationOpenOrderCanceled = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      orderId: event.params.orderId,
      trader: event.params.trader,
      pairIndex: event.params.pairIndex,
      cancelReason: event.params.cancelReason,
    };
    context.OstiumTradingCallbacks_AutomationOpenOrderCanceled.set(entity);
  }
);

OstiumTradingCallbacks.DevFeeCharged.handler(async ({ event, context }) => {
  const entity: OstiumTradingCallbacks_DevFeeCharged = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    tradeId: event.params.tradeId,
    trader: event.params.trader,
    amount: event.params.amount,
  };
  context.OstiumTradingCallbacks_DevFeeCharged.set(entity);
});

OstiumTradingCallbacks.VaultOpeningFeeCharged.handler(
  async ({ event, context }) => {
    const entity: OstiumTradingCallbacks_VaultOpeningFeeCharged = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      tradeId: event.params.tradeId,
      trader: event.params.trader,
      amount: event.params.amount,
    };
    context.OstiumTradingCallbacks_VaultOpeningFeeCharged.set(entity);
  }
);

OstiumTradingCallbacks.VaultLiqFeeCharged.handler(
  async ({ event, context }) => {
    const entity: OstiumTradingCallbacks_VaultLiqFeeCharged = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      orderId: event.params.orderId,
      tradeId: event.params.tradeId,
      trader: event.params.trader,
      amount: event.params.amount,
    };
    context.OstiumTradingCallbacks_VaultLiqFeeCharged.set(entity);
  }
);

OstiumTradingCallbacks.OracleFeeCharged.handler(async ({ event, context }) => {
  const entity: OstiumTradingCallbacks_OracleFeeCharged = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    tradeId: event.params.tradeId,
    trader: event.params.trader,
    amount: event.params.amount,
  };
  context.OstiumTradingCallbacks_OracleFeeCharged.set(entity);
});

OstiumTradingCallbacks.RemoveCollateralExecuted.handler(
  async ({ event, context }) => {
    const entity: OstiumTradingCallbacks_RemoveCollateralExecuted = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      tradeId: event.params.tradeId,
      orderId: event.params.orderId,
      trader: event.params.trader,
      pairIndex: event.params.pairIndex,
      removeAmount: event.params.removeAmount,
      leverage: event.params.leverage,
      tp: event.params.tp,
      sl: event.params.sl,
    };
    context.OstiumTradingCallbacks_RemoveCollateralExecuted.set(entity);
  }
);

OstiumTradingCallbacks.RemoveCollateralRejected.handler(
  async ({ event, context }) => {
    const entity: OstiumTradingCallbacks_RemoveCollateralRejected = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      tradeId: event.params.tradeId,
      orderId: event.params.orderId,
      trader: event.params.trader,
      pairIndex: event.params.pairIndex,
      removeAmount: event.params.removeAmount,
      reason: event.params.reason,
    };
    context.OstiumTradingCallbacks_RemoveCollateralRejected.set(entity);
  }
);

OstiumTradingCallbacks.FeesCharged.handler(async ({ event, context }) => {
  const entity: OstiumTradingCallbacks_FeesCharged = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    orderId: event.params.orderId,
    tradeId: event.params.tradeId,
    trader: event.params.trader,
    rolloverFees: event.params.rolloverFees,
    fundingFees: event.params.fundingFees,
  };
  context.OstiumTradingCallbacks_FeesCharged.set(entity);
});

OstiumTradingCallbacks.Paused.handler(async ({ event, context }) => {
  const entity: OstiumTradingCallbacks_Paused = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    paused: event.params.paused,
  };
  context.OstiumTradingCallbacks_Paused.set(entity);
});

// OstiumVault
OstiumVault.Deposit.handler(async ({ event, context }) => {
  const entity: OstiumVault_Deposit = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    sender: event.params.sender,
    owner: event.params.owner,
    assets: event.params.assets,
    shares: event.params.shares,
  };
  context.OstiumVault_Deposit.set(entity);
});

OstiumVault.Withdraw.handler(async ({ event, context }) => {
  const entity: OstiumVault_Withdraw = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    sender: event.params.sender,
    receiver: event.params.receiver,
    owner: event.params.owner,
    assets: event.params.assets,
    shares: event.params.shares,
  };
  context.OstiumVault_Withdraw.set(entity);
});

OstiumVault.WithdrawRequested.handler(async ({ event, context }) => {
  const entity: OstiumVault_WithdrawRequested = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    sender: event.params.sender,
    owner: event.params.owner,
    shares: event.params.shares,
    currEpoch: event.params.currEpoch,
    unlockEpoch: event.params.unlockEpoch,
  };
  context.OstiumVault_WithdrawRequested.set(entity);
});

OstiumVault.WithdrawCanceled.handler(async ({ event, context }) => {
  const entity: OstiumVault_WithdrawCanceled = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    sender: event.params.sender,
    owner: event.params.owner,
    shares: event.params.shares,
    currEpoch: event.params.currEpoch,
    unlockEpoch: event.params.unlockEpoch,
  };
  context.OstiumVault_WithdrawCanceled.set(entity);
});

OstiumVault.DepositLocked.handler(async ({ event, context }) => {
  const d = event.params._3;
  const entity: OstiumVault_DepositLocked = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    sender: event.params.sender,
    owner: event.params.owner,
    depositId: event.params.depositId,
    d_0: d[0],
    d_1: d[1],
    d_2: d[2],
    d_3: d[3],
    d_4: d[4],
    d_5: d[5],
  };
  context.OstiumVault_DepositLocked.set(entity);
});

OstiumVault.DepositUnlocked.handler(async ({ event, context }) => {
  const d = event.params._4;
  const entity: OstiumVault_DepositUnlocked = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    sender: event.params.sender,
    receiver: event.params.receiver,
    owner: event.params.owner,
    depositId: event.params.depositId,
    d_0: d[0],
    d_1: d[1],
    d_2: d[2],
    d_3: d[3],
    d_4: d[4],
    d_5: d[5],
  };
  context.OstiumVault_DepositUnlocked.set(entity);
});

OstiumVault.AccPnlPerTokenUsedUpdated.handler(async ({ event, context }) => {
  const entity: OstiumVault_AccPnlPerTokenUsedUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    sender: event.params.sender,
    prevPositiveOpenPnl: event.params.prevPositiveOpenPnl,
    newPositiveOpenPnl: event.params.newPositiveOpenPnl,
    newEpochPositiveOpenPnl: event.params.newEpochPositiveOpenPnl,
    newAccPnlPerTokenUsed: event.params.newAccPnlPerTokenUsed,
  };
  context.OstiumVault_AccPnlPerTokenUsedUpdated.set(entity);
});

OstiumVault.ShareToAssetsPriceUpdated.handler(async ({ event, context }) => {
  const entity: OstiumVault_ShareToAssetsPriceUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    value: event.params.value,
  };
  context.OstiumVault_ShareToAssetsPriceUpdated.set(entity);
});

OstiumVault.RewardDistributed.handler(async ({ event, context }) => {
  const entity: OstiumVault_RewardDistributed = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    sender: event.params.sender,
    assets: event.params.assets,
    accRewardsPerToken: event.params.accRewardsPerToken,
  };
  context.OstiumVault_RewardDistributed.set(entity);
});

OstiumVault.MaxDiscountPUpdated.handler(async ({ event, context }) => {
  const entity: OstiumVault_MaxDiscountPUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    value: event.params.value,
  };
  context.OstiumVault_MaxDiscountPUpdated.set(entity);
});

OstiumVault.MaxDiscountThresholdPUpdated.handler(async ({ event, context }) => {
  const entity: OstiumVault_MaxDiscountThresholdPUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    value: event.params.value,
  };
  context.OstiumVault_MaxDiscountThresholdPUpdated.set(entity);
});

OstiumVault.CurrentMaxSupplyUpdated.handler(async ({ event, context }) => {
  const entity: OstiumVault_CurrentMaxSupplyUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    value: event.params.value,
  };
  context.OstiumVault_CurrentMaxSupplyUpdated.set(entity);
});

OstiumVault.Transfer.handler(async ({ event, context }) => {
  const entity: OstiumVault_Transfer = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    from: event.params.from,
    to: event.params.to,
    value: event.params.value,
  };
  context.OstiumVault_Transfer.set(entity);
});

OstiumVault.Approval.handler(async ({ event, context }) => {
  const entity: OstiumVault_Approval = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    owner: event.params.owner,
    spender: event.params.spender,
    value: event.params.value,
  };
  context.OstiumVault_Approval.set(entity);
});

// OstiumLockedDepositNft
OstiumLockedDepositNft.Transfer.handler(async ({ event, context }) => {
  const entity: OstiumLockedDepositNft_Transfer = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    from: event.params.from,
    to: event.params.to,
    tokenId: event.params.tokenId,
  };
  context.OstiumLockedDepositNft_Transfer.set(entity);
});

// OstiumTradingStorage
OstiumTradingStorage.MaxOpenInterestUpdated.handler(
  async ({ event, context }) => {
    const entity: OstiumTradingStorage_MaxOpenInterestUpdated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      pairIndex: event.params.pairIndex,
      value: event.params.value,
    };
    context.OstiumTradingStorage_MaxOpenInterestUpdated.set(entity);
  }
);

OstiumTradingStorage.MaxTradesPerPairUpdated.handler(
  async ({ event, context }) => {
    const entity: OstiumTradingStorage_MaxTradesPerPairUpdated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      value: event.params.value,
    };
    context.OstiumTradingStorage_MaxTradesPerPairUpdated.set(entity);
  }
);

OstiumTradingStorage.MaxPendingMarketOrdersUpdated.handler(
  async ({ event, context }) => {
    const entity: OstiumTradingStorage_MaxPendingMarketOrdersUpdated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      value: event.params.value,
    };
    context.OstiumTradingStorage_MaxPendingMarketOrdersUpdated.set(entity);
  }
);

// OstiumOpenPnl
OstiumOpenPnl.LastTradePriceUpdated.handler(async ({ event, context }) => {
  const entity: OstiumOpenPnl_LastTradePriceUpdated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    pairIndex: event.params.pairIndex,
    lastTradePrice: event.params.lastTradePrice,
  };
  context.OstiumOpenPnl_LastTradePriceUpdated.set(entity);
});
