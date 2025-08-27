/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  OstiumPairsInfos,
  OstiumPairsStorage,
  OstiumTrading,
  OstiumTradingCallbacks,
  OstiumVault,
  OstiumLockedDepositNft,
  OstiumTradingStorage,
  OstiumOpenPnl,
  Pair as PairEntity,
  MetaData as MetaDataEntity,
  Vault as VaultEntity,
  Order as OrderEntity,
  Trade as TradeEntity,
  Limit as LimitEntity,
  LpShare as LpShareEntity,
  LpAction as LpActionEntity,
  LpNFT as LpNFTEntity,
  User as UserEntity,
  UserPairStat as UserPairStatEntity,
  ShareToAssetsPriceDaily as ShareToAssetsPriceDailyEntity,
  EpochShare as EpochShareEntity,
} from "generated";

function toDayString(ts: bigint): string {
  const d = new Date(Number(ts) * 1000);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

async function getMeta(context: any): Promise<MetaDataEntity> {
  const id = "global";
  const existing = await context.MetaData.get(id);
  const base: MetaDataEntity = { id } as unknown as MetaDataEntity;
  return existing ? (existing as MetaDataEntity) : base;
}

function add(a?: bigint, b?: bigint): bigint {
  return (a ?? 0n) + (b ?? 0n);
}

// =====================
// PAIR STORAGE HANDLERS
// =====================

OstiumPairsStorage.PairAdded.handler(async ({ event, context }) => {
  const pairId = event.params.index.toString();
  const existing = await context.Pair.get(pairId);
  const pair: PairEntity = {
    id: pairId,
    from: event.params.from,
    to: event.params.to,
  } as PairEntity;
  context.Pair.set(existing ? { ...existing, ...pair } : pair);
});

OstiumPairsStorage.PairMaxLeverageUpdated.handler(
  async ({ event, context }) => {
    const pairId = event.params.pairIndex.toString();
    const existing = await context.Pair.get(pairId);
    if (existing) {
      const updated: PairEntity = {
        ...existing,
        maxLeverage: event.params.maxLeverage,
      };
      context.Pair.set(updated);
    }
  }
);

OstiumPairsStorage.PairOvernightMaxLeverageUpdated.handler(
  async ({ event, context }) => {
    const pairId = event.params.pairIndex.toString();
    const existing = await context.Pair.get(pairId);
    if (existing) {
      const updated: PairEntity = {
        ...existing,
        overnightMaxLeverage: event.params.overnightMaxLeverage,
      };
      context.Pair.set(updated);
    }
  }
);

// =====================
// PAIR INFO HANDLERS
// =====================

OstiumPairsInfos.PairOpeningFeesUpdated.handler(async ({ event, context }) => {
  const pairId = event.params.pairIndex.toString();
  const existingPair = await context.Pair.get(pairId);
  if (existingPair) {
    const updatedPair: PairEntity = {
      ...existingPair,
      makerFeeP: event.params.value[0],
      takerFeeP: event.params.value[1],
      usageFeeP: event.params.value[2],
      utilizationThresholdP: event.params.value[3],
      makerMaxLeverage: event.params.value[4],
      vaultFeePercent: event.params.value[5],
    } as PairEntity;
    context.Pair.set(updatedPair);
  }
});

OstiumPairsInfos.PairRolloverFeesUpdated.handler(async ({ event, context }) => {
  const pairId = event.params.pairIndex.toString();
  const existing = await context.Pair.get(pairId);
  if (existing) {
    const updated: PairEntity = {
      ...existing,
      accRollover: event.params.value[0],
      rolloverFeePerBlock: event.params.value[1],
      maxRolloverFeePerBlock: event.params.value[2],
      maxRolloverVolatility: event.params.value[3],
      lastRolloverBlock: event.params.value[4],
      rolloverFeeSlope: event.params.value[5],
    } as PairEntity;
    context.Pair.set(updated);
  }
});

OstiumPairsInfos.RolloverFeePerBlockUpdated.handler(
  async ({ event, context }) => {
    const pairId = event.params.pairIndex.toString();
    const existing = await context.Pair.get(pairId);
    if (existing) {
      const updated: PairEntity = {
        ...existing,
        rolloverFeePerBlock: event.params.value,
      };
      context.Pair.set(updated);
    }
  }
);

OstiumPairsInfos.FeesCharged.handler(async ({ event, context }) => {
  // Accumulate fees into Trade entity
  const tradeId = event.params.tradeId.toString();
  const trade = await context.Trade.get(tradeId);
  if (trade) {
    const updatedTrade: TradeEntity = {
      ...trade,
      rollover: add(
        trade.rollover as unknown as bigint | undefined,
        event.params.rolloverFees
      ),
      funding: add(
        trade.funding as unknown as bigint | undefined,
        event.params.fundingFees
      ),
    } as unknown as TradeEntity;
    context.Trade.set(updatedTrade);
  }

  // Update user fee counters
  const userId = event.params.trader.toLowerCase();
  const user = await context.User.get(userId);
  const userUpdated: UserEntity = {
    id: userId,
    totalRolloverFee: add(
      user?.totalRolloverFee as unknown as bigint | undefined,
      event.params.rolloverFees
    ),
    netFundingPayment: add(
      user?.netFundingPayment as unknown as bigint | undefined,
      event.params.fundingFees
    ),
  } as unknown as UserEntity;
  context.User.set(user ? { ...user, ...userUpdated } : userUpdated);

  // Update UserPairStat if we can determine the pair
  if (trade?.pair_id) {
    const upsId = `${userId}_${trade.pair_id}`;
    const ups = await context.UserPairStat.get(upsId);
    const upsUpdated: UserPairStatEntity = {
      id: upsId,
      user_id: userId,
      pair_id: trade.pair_id,
      totalRolloverFee: add(
        ups?.totalRolloverFee as unknown as bigint | undefined,
        event.params.rolloverFees
      ),
      netFundingPayment: add(
        ups?.netFundingPayment as unknown as bigint | undefined,
        event.params.fundingFees
      ),
    } as unknown as UserPairStatEntity;
    context.UserPairStat.set(ups ? { ...ups, ...upsUpdated } : upsUpdated);
  }

  // Update MetaData global counters
  const meta = await getMeta(context);
  const metaUpdated: MetaDataEntity = {
    ...meta,
    totalRolloverFee: add(
      meta.totalRolloverFee as unknown as bigint | undefined,
      event.params.rolloverFees
    ),
  } as unknown as MetaDataEntity;
  context.MetaData.set(metaUpdated);
});

// =====================
// TRADING HANDLERS
// =====================

OstiumTrading.MarketOpenOrderInitiated.handler(async ({ event, context }) => {
  // Seed Trade and User counters
  const tradeId = `${event.params.trader.toLowerCase()}_${event.params.pairIndex.toString()}_${event.params.orderId.toString()}`;
  const trade: TradeEntity = {
    id: tradeId,
    trader: event.params.trader,
    pair_id: event.params.pairIndex.toString(),
    isOpen: true,
    timestamp: BigInt(event.block.timestamp),
  } as TradeEntity;
  const existingTrade = await context.Trade.get(tradeId);
  context.Trade.set(existingTrade ? { ...existingTrade, ...trade } : trade);

  const userId = event.params.trader.toLowerCase();
  const user = await context.User.get(userId);
  const updatedUser: UserEntity = {
    id: userId,
    totalMarketOrders:
      ((user?.totalMarketOrders as unknown as bigint) ?? BigInt(0)) + BigInt(1),
  } as unknown as UserEntity;
  context.User.set(user ? { ...user, ...updatedUser } : updatedUser);

  // bump MetaData totalMarketOrders
  const meta = await getMeta(context);
  const bumpedMeta: MetaDataEntity = {
    ...meta,
    totalMarketOrders: add(
      meta.totalMarketOrders as unknown as bigint | undefined,
      1n
    ),
  } as unknown as MetaDataEntity;
  context.MetaData.set(bumpedMeta);
});

OstiumTrading.OpenLimitCanceled.handler(async ({ event, context }) => {
  // Decrement Pair and MetaData open limit counts and bump cancellations
  const pairId = event.params.pairIndex.toString();
  const pair = await context.Pair.get(pairId);
  if (pair) {
    const newCount = add(
      pair.totalOpenLimitOrders as unknown as bigint | undefined,
      -1n
    );
    const updatedPair: PairEntity = {
      ...pair,
      totalOpenLimitOrders: newCount < 0n ? 0n : newCount,
    } as unknown as PairEntity;
    context.Pair.set(updatedPair);
  }

  const meta = await getMeta(context);
  const newOpenLimits = add(
    meta.totalOpenLimitOrders as unknown as bigint | undefined,
    -1n
  );
  const metaUpd: MetaDataEntity = {
    ...meta,
    totalOpenLimitOrders: newOpenLimits < 0n ? 0n : newOpenLimits,
    totalCancelledOrders: add(
      meta.totalCancelledOrders as unknown as bigint | undefined,
      1n
    ),
  } as unknown as MetaDataEntity;
  context.MetaData.set(metaUpd);

  // Bump user and user-pair canceled
  const userId = event.params.trader.toLowerCase();
  const user = await context.User.get(userId);
  const userUpd: UserEntity = {
    id: userId,
    totalCancelledOrders: add(
      user?.totalCancelledOrders as unknown as bigint | undefined,
      1n
    ),
  } as unknown as UserEntity;
  context.User.set(user ? { ...user, ...userUpd } : userUpd);

  const upsId = `${userId}_${pairId}`;
  const ups = await context.UserPairStat.get(upsId);
  const upsUpd: UserPairStatEntity = {
    id: upsId,
    user_id: userId,
    pair_id: pairId,
    totalCancelledOrders: add(
      ups?.totalCancelledOrders as unknown as bigint | undefined,
      1n
    ),
  } as unknown as UserPairStatEntity;
  context.UserPairStat.set(ups ? { ...ups, ...upsUpd } : upsUpd);
});

OstiumTrading.OpenLimitPlaced.handler(async ({ event, context }) => {
  // Create/Update Limit entity
  const limitId = `${event.params.trader.toLowerCase()}_${event.params.pairIndex.toString()}_${event.params.index.toString()}`;
  const limit: LimitEntity = {
    id: limitId,
    trader: event.params.trader,
    pair_id: event.params.pairIndex.toString(),
    isActive: true,
    initiatedAt: BigInt(event.block.timestamp),
  } as LimitEntity;
  const existingLimit = await context.Limit.get(limitId);
  context.Limit.set(existingLimit ? { ...existingLimit, ...limit } : limit);

  // Bump user counter
  const userId = event.params.trader.toLowerCase();
  const user = await context.User.get(userId);
  const updatedUser: UserEntity = {
    id: userId,
    totalOpenLimitOrders:
      ((user?.totalOpenLimitOrders as unknown as bigint) ?? BigInt(0)) +
      BigInt(1),
  } as unknown as UserEntity;
  context.User.set(user ? { ...user, ...updatedUser } : updatedUser);

  // UserPairStat bump
  const pairId = event.params.pairIndex.toString();
  const upsId = `${userId}_${pairId}`;
  const ups = await context.UserPairStat.get(upsId);
  const upsUpdated: UserPairStatEntity = {
    id: upsId,
    user_id: userId,
    pair_id: pairId,
    totalOpenLimitOrders: add(
      ups?.totalOpenLimitOrders as unknown as bigint | undefined,
      1n
    ),
  } as unknown as UserPairStatEntity;
  context.UserPairStat.set(ups ? { ...ups, ...upsUpdated } : upsUpdated);

  // Pair + Meta bumps
  const pairExisting = await context.Pair.get(pairId);
  if (pairExisting) {
    const pairUpdated: PairEntity = {
      ...pairExisting,
      totalOpenLimitOrders: add(
        pairExisting.totalOpenLimitOrders as unknown as bigint | undefined,
        1n
      ),
    } as unknown as PairEntity;
    context.Pair.set(pairUpdated);
  }

  const meta = await getMeta(context);
  const metaUpdated: MetaDataEntity = {
    ...meta,
    totalOpenLimitOrders: add(
      meta.totalOpenLimitOrders as unknown as bigint | undefined,
      1n
    ),
  } as unknown as MetaDataEntity;
  context.MetaData.set(metaUpdated);
});

// =====================
// TRADING CALLBACKS
// =====================

OstiumTradingCallbacks.MarketOpenExecuted.handler(
  async ({ event, context }) => {
    const t = event.params._1;

    // Create comprehensive Order entity
    const orderOpen: OrderEntity = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      orderType: "market_open_exec",
      orderAction: "open",
      trader: t[4],
      pair_id: t[1]?.toString() ?? "",
      trade_id: t[0]?.toString() ?? "",
      price: t[2],
      priceAfterImpact: t[2],
      priceImpactP: event.params.priceImpactP,
      collateral: t[5],
      notional: event.params.tradeNotional,
      tradeNotional: event.params.tradeNotional,
      isBuy: t[8] as unknown as boolean,
      leverage: t[6],
      executedAt: BigInt(event.block.timestamp),
      executedBlock: event.block.number,
      isPending: false,
      isCancelled: false,
      initiatedAt: BigInt(event.block.timestamp),
      initiatedTx: event.transaction.hash,
      initiatedBlock: event.block.number,
      executedTx: event.transaction.hash,
      profitPercent: 0n,
      totalProfitPercent: 0n,
      amountSentToTrader: 0n,
      limit_id: "",
      cancelReason: "",
      devFee: 0n,
      vaultFee: 0n,
      oracleFee: 0n,
      liquidationFee: 0n,
      fundingFee: 0n,
      rolloverFee: 0n,
      closePercent: 0n,
    } as unknown as OrderEntity;
    context.Order.set(orderOpen);

    // Update or create Trade entity with complete information
    const tradeId = t[0]?.toString();
    if (tradeId) {
      const existingTrade = await context.Trade.get(tradeId);
      const updatedTrade: TradeEntity = {
        id: tradeId,
        trader: t[4],
        pair_id: t[1]?.toString() ?? "",
        index: t[7]?.toString() ?? "",
        trade_id: tradeId,
        tradeType: "market",
        openPrice: t[2],
        takeProfitPrice: t[3],
        stopLossPrice: 0n,
        collateral: t[5],
        notional: event.params.tradeNotional,
        tradeNotional: event.params.tradeNotional,
        leverage: t[6],
        highestLeverage: t[6],
        isBuy: t[8] as unknown as boolean,
        isOpen: true,
        closeInitiated: 0n,
        funding: existingTrade?.funding ?? 0n,
        rollover: existingTrade?.rollover ?? 0n,
        timestamp: BigInt(event.block.timestamp),
        closePrice: 0n,
      } as unknown as TradeEntity;
      context.Trade.set(updatedTrade);

      // Update user statistics
      const userId = t[4].toLowerCase();
      const user = await context.User.get(userId);
      const userUpdated: UserEntity = {
        id: userId,
        totalOpenTrades: add(
          user?.totalOpenTrades as unknown as bigint | undefined,
          1n
        ),
        totalTrades: add(
          user?.totalTrades as unknown as bigint | undefined,
          1n
        ),
        totalVolume: add(
          user?.totalVolume as unknown as bigint | undefined,
          event.params.tradeNotional
        ),
        totalOpenVolume: add(
          user?.totalOpenVolume as unknown as bigint | undefined,
          event.params.tradeNotional
        ),
      } as unknown as UserEntity;
      context.User.set(user ? { ...user, ...userUpdated } : userUpdated);

      // Update UserPairStat
      const pairId = t[1]?.toString();
      if (pairId) {
        const upsId = `${userId}_${pairId}`;
        const ups = await context.UserPairStat.get(upsId);
        const upsUpdated: UserPairStatEntity = {
          id: upsId,
          user_id: userId,
          pair_id: pairId,
          totalOpenTrades: add(
            ups?.totalOpenTrades as unknown as bigint | undefined,
            1n
          ),
          totalTrades: add(
            ups?.totalTrades as unknown as bigint | undefined,
            1n
          ),
          totalMarketOrders: add(
            ups?.totalMarketOrders as unknown as bigint | undefined,
            1n
          ),
          totalVolume: add(
            ups?.totalVolume as unknown as bigint | undefined,
            event.params.tradeNotional
          ),
          totalOpenVolume: add(
            ups?.totalOpenVolume as unknown as bigint | undefined,
            event.params.tradeNotional
          ),
        } as unknown as UserPairStatEntity;
        context.UserPairStat.set(ups ? { ...ups, ...upsUpdated } : upsUpdated);
      }

      // Update pair statistics
      if (pairId) {
        const pair = await context.Pair.get(pairId);
        if (pair) {
          const pairUpdated: PairEntity = {
            ...pair,
            totalOpenTrades: add(
              pair.totalOpenTrades as unknown as bigint | undefined,
              1n
            ),
            volume: add(
              pair.volume as unknown as bigint | undefined,
              event.params.tradeNotional
            ),
          } as unknown as PairEntity;
          context.Pair.set(pairUpdated);
        }
      }

      // Update MetaData
      const meta = await getMeta(context);
      const metaUpdated: MetaDataEntity = {
        ...meta,
        totalOpenTrades: add(
          meta.totalOpenTrades as unknown as bigint | undefined,
          1n
        ),
        totalTrades: add(meta.totalTrades as unknown as bigint | undefined, 1n),
        totalVolume: add(
          meta.totalVolume as unknown as bigint | undefined,
          event.params.tradeNotional
        ),
        totalOpenVolume: add(
          meta.totalOpenVolume as unknown as bigint | undefined,
          event.params.tradeNotional
        ),
      } as unknown as MetaDataEntity;
      context.MetaData.set(metaUpdated);
    }
  }
);

OstiumTradingCallbacks.MarketCloseExecuted.handler(
  async ({ event, context }) => {
    const orderClose: OrderEntity = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      orderType: "market_close_exec",
      orderAction: "close",
      trader: "",
      pair_id: "",
      trade_id: event.params.tradeId.toString(),
      price: event.params.price,
      priceAfterImpact: event.params.price,
      priceImpactP: event.params.priceImpactP,
      profitPercent: event.params.percentProfit,
      totalProfitPercent: event.params.percentProfit,
      amountSentToTrader: event.params.usdcSentToTrader,
      executedAt: BigInt(event.block.timestamp),
      executedBlock: event.block.number,
      isPending: false,
      isCancelled: false,
      closePercent: 100n,
      collateral: 0n,
      notional: 0n,
      tradeNotional: 0n,
      isBuy: false,
      initiatedAt: BigInt(event.block.timestamp),
      initiatedTx: event.transaction.hash,
      initiatedBlock: event.block.number,
      executedTx: event.transaction.hash,
      leverage: 0n,
      limit_id: "",
      cancelReason: "",
      devFee: 0n,
      vaultFee: 0n,
      oracleFee: 0n,
      liquidationFee: 0n,
      fundingFee: 0n,
      rolloverFee: 0n,
    } as unknown as OrderEntity;
    context.Order.set(orderClose);

    const tId = event.params.tradeId.toString();
    const tr = await context.Trade.get(tId);
    if (tr) {
      const closed: TradeEntity = {
        ...tr,
        isOpen: false,
        closePrice: event.params.price,
      } as unknown as TradeEntity;
      context.Trade.set(closed);

      // Update user statistics
      const userId = tr.trader?.toLowerCase();
      if (userId) {
        const user = await context.User.get(userId);
        const isProfit = event.params.percentProfit > 0n;
        const userUpdated: UserEntity = {
          id: userId,
          totalOpenTrades: add(
            user?.totalOpenTrades as unknown as bigint | undefined,
            -1n
          ),
          totalClosedVolume: add(
            user?.totalClosedVolume as unknown as bigint | undefined,
            tr.tradeNotional as unknown as bigint
          ),
          totalOpenVolume: add(
            user?.totalOpenVolume as unknown as bigint | undefined,
            -(tr.tradeNotional as unknown as bigint)
          ),
          totalClosedCollateral: add(
            user?.totalClosedCollateral as unknown as bigint | undefined,
            tr.collateral as unknown as bigint
          ),
          totalProfitTrades: add(
            user?.totalProfitTrades as unknown as bigint | undefined,
            isProfit ? 1n : 0n
          ),
          totalLossTrades: add(
            user?.totalLossTrades as unknown as bigint | undefined,
            isProfit ? 0n : 1n
          ),
          totalPnL: add(
            user?.totalPnL as unknown as bigint | undefined,
            event.params.percentProfit
          ),
        } as unknown as UserEntity;
        context.User.set(user ? { ...user, ...userUpdated } : userUpdated);

        // Update UserPairStat
        const pairId = tr.pair_id;
        if (pairId) {
          const upsId = `${userId}_${pairId}`;
          const ups = await context.UserPairStat.get(upsId);
          const upsUpdated: UserPairStatEntity = {
            id: upsId,
            user_id: userId,
            pair_id: pairId,
            totalOpenTrades: add(
              ups?.totalOpenTrades as unknown as bigint | undefined,
              -1n
            ),
            totalClosedVolume: add(
              ups?.totalClosedVolume as unknown as bigint | undefined,
              tr.tradeNotional as unknown as bigint
            ),
            totalOpenVolume: add(
              ups?.totalOpenVolume as unknown as bigint | undefined,
              -(tr.tradeNotional as unknown as bigint)
            ),
            totalClosedCollateral: add(
              ups?.totalClosedCollateral as unknown as bigint | undefined,
              tr.collateral as unknown as bigint
            ),
            totalProfitTrades: add(
              ups?.totalProfitTrades as unknown as bigint | undefined,
              isProfit ? 1n : 0n
            ),
            totalLossTrades: add(
              ups?.totalLossTrades as unknown as bigint | undefined,
              isProfit ? 0n : 1n
            ),
            totalPnL: add(
              ups?.totalPnL as unknown as bigint | undefined,
              event.params.percentProfit
            ),
          } as unknown as UserPairStatEntity;
          context.UserPairStat.set(
            ups ? { ...ups, ...upsUpdated } : upsUpdated
          );
        }
      }

      // Update Pair statistics
      const pairId = tr.pair_id;
      if (pairId) {
        const pair = await context.Pair.get(pairId);
        if (pair) {
          const pairUpdated: PairEntity = {
            ...pair,
            totalOpenTrades: add(
              pair.totalOpenTrades as unknown as bigint | undefined,
              -1n
            ),
          } as unknown as PairEntity;
          context.Pair.set(pairUpdated);
        }
      }

      // Update MetaData
      const meta = await getMeta(context);
      const isProfit = event.params.percentProfit > 0n;
      const metaUpdated: MetaDataEntity = {
        ...meta,
        totalOpenTrades: add(
          meta.totalOpenTrades as unknown as bigint | undefined,
          -1n
        ),
        totalClosedVolume: add(
          meta.totalClosedVolume as unknown as bigint | undefined,
          tr.tradeNotional as unknown as bigint
        ),
        totalOpenVolume: add(
          meta.totalOpenVolume as unknown as bigint | undefined,
          -(tr.tradeNotional as unknown as bigint)
        ),
        totalProfitTrades: add(
          meta.totalProfitTrades as unknown as bigint | undefined,
          isProfit ? 1n : 0n
        ),
        totalLossTrades: add(
          meta.totalLossTrades as unknown as bigint | undefined,
          isProfit ? 0n : 1n
        ),
        totalPnL: add(
          meta.totalPnL as unknown as bigint | undefined,
          event.params.percentProfit
        ),
      } as unknown as MetaDataEntity;
      context.MetaData.set(metaUpdated);
    }
  }
);

OstiumTradingCallbacks.LimitOpenExecuted.handler(async ({ event, context }) => {
  const t = event.params._2;

  const orderLimitOpen: OrderEntity = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    orderType: "limit_open_exec",
    orderAction: "open",
    trader: t[4],
    pair_id: t[1]?.toString() ?? "",
    trade_id: t[0]?.toString() ?? "",
    limit_id: event.params.limitIndex.toString(),
    price: t[2],
    priceAfterImpact: t[2],
    priceImpactP: event.params.priceImpactP,
    collateral: t[5],
    notional: event.params.tradeNotional,
    tradeNotional: event.params.tradeNotional,
    isBuy: t[8] as unknown as boolean,
    leverage: t[6],
    executedAt: BigInt(event.block.timestamp),
    executedBlock: event.block.number,
    isPending: false,
    isCancelled: false,
    initiatedAt: BigInt(event.block.timestamp),
    initiatedTx: event.transaction.hash,
    initiatedBlock: event.block.number,
    executedTx: event.transaction.hash,
    profitPercent: 0n,
    totalProfitPercent: 0n,
    amountSentToTrader: 0n,
    cancelReason: "",
    devFee: 0n,
    vaultFee: 0n,
    oracleFee: 0n,
    liquidationFee: 0n,
    fundingFee: 0n,
    rolloverFee: 0n,
    closePercent: 0n,
  } as unknown as OrderEntity;
  context.Order.set(orderLimitOpen);

  // Update Limit entity
  const possibleLimitId = `${t[4].toLowerCase()}_${t[1]?.toString()}_${event.params.limitIndex.toString()}`;
  const limitEnt = await context.Limit.get(possibleLimitId);
  if (limitEnt) {
    const updatedLimit: LimitEntity = {
      ...limitEnt,
      isActive: false,
      executionStarted: BigInt(event.block.timestamp),
      updatedAt: BigInt(event.block.timestamp),
      orderId: event.params.orderId.toString(),
    } as unknown as LimitEntity;
    context.Limit.set(updatedLimit);
  }

  // Create/Update Trade entity (similar to market open)
  const tradeId = t[0]?.toString();
  if (tradeId) {
    const existingTrade = await context.Trade.get(tradeId);
    const updatedTrade: TradeEntity = {
      id: tradeId,
      trader: t[4],
      pair_id: t[1]?.toString() ?? "",
      index: t[7]?.toString() ?? "",
      trade_id: tradeId,
      tradeType: "limit",
      openPrice: t[2],
      takeProfitPrice: t[3],
      stopLossPrice: 0n,
      collateral: t[5],
      notional: event.params.tradeNotional,
      tradeNotional: event.params.tradeNotional,
      leverage: t[6],
      highestLeverage: t[6],
      isBuy: t[8] as unknown as boolean,
      isOpen: true,
      closeInitiated: 0n,
      funding: existingTrade?.funding ?? 0n,
      rollover: existingTrade?.rollover ?? 0n,
      timestamp: BigInt(event.block.timestamp),
      closePrice: 0n,
    } as unknown as TradeEntity;
    context.Trade.set(updatedTrade);

    // Update user statistics (similar to market open)
    const userId = t[4].toLowerCase();
    const user = await context.User.get(userId);
    const userUpdated: UserEntity = {
      id: userId,
      totalOpenTrades: add(
        user?.totalOpenTrades as unknown as bigint | undefined,
        1n
      ),
      totalTrades: add(user?.totalTrades as unknown as bigint | undefined, 1n),
      totalVolume: add(
        user?.totalVolume as unknown as bigint | undefined,
        event.params.tradeNotional
      ),
      totalOpenVolume: add(
        user?.totalOpenVolume as unknown as bigint | undefined,
        event.params.tradeNotional
      ),
      totalOpenLimitOrders: add(
        user?.totalOpenLimitOrders as unknown as bigint | undefined,
        -1n
      ), // Limit was consumed
    } as unknown as UserEntity;
    context.User.set(user ? { ...user, ...userUpdated } : userUpdated);

    // Update UserPairStat
    const pairIdForStats = t[1]?.toString();
    if (pairIdForStats) {
      const upsId = `${userId}_${pairIdForStats}`;
      const ups = await context.UserPairStat.get(upsId);
      const upsUpdated: UserPairStatEntity = {
        id: upsId,
        user_id: userId,
        pair_id: pairIdForStats,
        totalOpenTrades: add(
          ups?.totalOpenTrades as unknown as bigint | undefined,
          1n
        ),
        totalTrades: add(ups?.totalTrades as unknown as bigint | undefined, 1n),
        totalVolume: add(
          ups?.totalVolume as unknown as bigint | undefined,
          event.params.tradeNotional
        ),
        totalOpenVolume: add(
          ups?.totalOpenVolume as unknown as bigint | undefined,
          event.params.tradeNotional
        ),
        totalOpenLimitOrders: add(
          ups?.totalOpenLimitOrders as unknown as bigint | undefined,
          -1n
        ),
      } as unknown as UserPairStatEntity;
      context.UserPairStat.set(ups ? { ...ups, ...upsUpdated } : upsUpdated);
    }
  }
});

OstiumTradingCallbacks.LimitCloseExecuted.handler(
  async ({ event, context }) => {
    const orderLimitClose: OrderEntity = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      orderType: "limit_close_exec",
      orderAction: "close",
      trader: "",
      pair_id: "",
      trade_id: event.params.tradeId.toString(),
      price: event.params.price,
      priceAfterImpact: event.params.price,
      priceImpactP: event.params.priceImpactP,
      profitPercent: event.params.percentProfit,
      totalProfitPercent: event.params.percentProfit,
      amountSentToTrader: event.params.usdcSentToTrader,
      executedAt: BigInt(event.block.timestamp),
      executedBlock: event.block.number,
      isPending: false,
      isCancelled: false,
      closePercent: 100n,
      collateral: 0n,
      notional: 0n,
      tradeNotional: 0n,
      isBuy: false,
      initiatedAt: BigInt(event.block.timestamp),
      initiatedTx: event.transaction.hash,
      initiatedBlock: event.block.number,
      executedTx: event.transaction.hash,
      leverage: 0n,
      limit_id: "",
      cancelReason: "",
      devFee: 0n,
      vaultFee: 0n,
      oracleFee: 0n,
      liquidationFee: 0n,
      fundingFee: 0n,
      rolloverFee: 0n,
    } as unknown as OrderEntity;
    context.Order.set(orderLimitClose);

    // Close the trade and update statistics (similar to market close)
    const tId = event.params.tradeId.toString();
    const tr = await context.Trade.get(tId);
    if (tr) {
      const closed: TradeEntity = {
        ...tr,
        isOpen: false,
        closePrice: event.params.price,
      } as unknown as TradeEntity;
      context.Trade.set(closed);

      // Update user statistics
      const userId = tr.trader?.toLowerCase();
      if (userId) {
        const user = await context.User.get(userId);
        const isProfit = event.params.percentProfit > 0n;
        const userUpdated: UserEntity = {
          id: userId,
          totalOpenTrades: add(
            user?.totalOpenTrades as unknown as bigint | undefined,
            -1n
          ),
          totalClosedVolume: add(
            user?.totalClosedVolume as unknown as bigint | undefined,
            tr.tradeNotional as unknown as bigint
          ),
          totalOpenVolume: add(
            user?.totalOpenVolume as unknown as bigint | undefined,
            -(tr.tradeNotional as unknown as bigint)
          ),
          totalClosedCollateral: add(
            user?.totalClosedCollateral as unknown as bigint | undefined,
            tr.collateral as unknown as bigint
          ),
          totalProfitTrades: add(
            user?.totalProfitTrades as unknown as bigint | undefined,
            isProfit ? 1n : 0n
          ),
          totalLossTrades: add(
            user?.totalLossTrades as unknown as bigint | undefined,
            isProfit ? 0n : 1n
          ),
          totalPnL: add(
            user?.totalPnL as unknown as bigint | undefined,
            event.params.percentProfit
          ),
          totalTPOrders: add(
            user?.totalTPOrders as unknown as bigint | undefined,
            1n
          ), // Count as TP order
        } as unknown as UserEntity;
        context.User.set(user ? { ...user, ...userUpdated } : userUpdated);
      }
    }
  }
);

// Fee tracking handlers
OstiumTradingCallbacks.FeesCharged.handler(async ({ event, context }) => {
  // Update Order entity with fees
  const orderEntity: OrderEntity = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}_fees`,
    orderType: "fees_charged",
    orderAction: "fee",
    trader: event.params.trader,
    pair_id: "",
    trade_id: event.params.tradeId.toString(),
    rolloverFee: event.params.rolloverFees,
    fundingFee: event.params.fundingFees,
    executedAt: BigInt(event.block.timestamp),
    executedBlock: event.block.number,
    price: 0n,
    priceAfterImpact: 0n,
    priceImpactP: 0n,
    collateral: 0n,
    notional: 0n,
    tradeNotional: 0n,
    profitPercent: 0n,
    totalProfitPercent: 0n,
    amountSentToTrader: 0n,
    isBuy: false,
    initiatedAt: BigInt(event.block.timestamp),
    initiatedTx: event.transaction.hash,
    initiatedBlock: event.block.number,
    executedTx: event.transaction.hash,
    leverage: 0n,
    isPending: false,
    isCancelled: false,
    limit_id: "",
    cancelReason: "",
    devFee: 0n,
    vaultFee: 0n,
    oracleFee: 0n,
    liquidationFee: 0n,
    closePercent: 0n,
  } as unknown as OrderEntity;
  context.Order.set(orderEntity);

  // Accumulate fees into Trade entity (same as PairsInfos version)
  const tradeId = event.params.tradeId.toString();
  const trade = await context.Trade.get(tradeId);
  if (trade) {
    const updatedTrade: TradeEntity = {
      ...trade,
      rollover: add(
        trade.rollover as unknown as bigint | undefined,
        event.params.rolloverFees
      ),
      funding: add(
        trade.funding as unknown as bigint | undefined,
        event.params.fundingFees
      ),
    } as unknown as TradeEntity;
    context.Trade.set(updatedTrade);
  }

  // Update user fee counters
  const userId = event.params.trader.toLowerCase();
  const user = await context.User.get(userId);
  const userUpdated: UserEntity = {
    id: userId,
    totalRolloverFee: add(
      user?.totalRolloverFee as unknown as bigint | undefined,
      event.params.rolloverFees
    ),
    netFundingPayment: add(
      user?.netFundingPayment as unknown as bigint | undefined,
      event.params.fundingFees
    ),
  } as unknown as UserEntity;
  context.User.set(user ? { ...user, ...userUpdated } : userUpdated);
});

OstiumTradingCallbacks.DevFeeCharged.handler(async ({ event, context }) => {
  // Create Order record for dev fee
  const orderEntity: OrderEntity = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}_devfee`,
    orderType: "dev_fee_charged",
    orderAction: "fee",
    trader: event.params.trader,
    pair_id: "",
    trade_id: event.params.tradeId.toString(),
    devFee: event.params.amount,
    executedAt: BigInt(event.block.timestamp),
    executedBlock: event.block.number,
    price: 0n,
    priceAfterImpact: 0n,
    priceImpactP: 0n,
    collateral: 0n,
    notional: 0n,
    tradeNotional: 0n,
    profitPercent: 0n,
    totalProfitPercent: 0n,
    amountSentToTrader: 0n,
    isBuy: false,
    initiatedAt: BigInt(event.block.timestamp),
    initiatedTx: event.transaction.hash,
    initiatedBlock: event.block.number,
    executedTx: event.transaction.hash,
    leverage: 0n,
    isPending: false,
    isCancelled: false,
    limit_id: "",
    cancelReason: "",
    vaultFee: 0n,
    oracleFee: 0n,
    liquidationFee: 0n,
    fundingFee: 0n,
    rolloverFee: 0n,
    closePercent: 0n,
  } as unknown as OrderEntity;
  context.Order.set(orderEntity);

  // Update user dev fee total
  const userId = event.params.trader.toLowerCase();
  const user = await context.User.get(userId);
  const userUpdated: UserEntity = {
    id: userId,
    totalDevFee: add(
      user?.totalDevFee as unknown as bigint | undefined,
      event.params.amount
    ),
  } as unknown as UserEntity;
  context.User.set(user ? { ...user, ...userUpdated } : userUpdated);

  // Update UserPairStat if we can determine the pair
  const trade = await context.Trade.get(event.params.tradeId.toString());
  if (trade?.pair_id) {
    const upsId = `${userId}_${trade.pair_id}`;
    const ups = await context.UserPairStat.get(upsId);
    const upsUpdated: UserPairStatEntity = {
      id: upsId,
      user_id: userId,
      pair_id: trade.pair_id,
      totalDevFee: add(
        ups?.totalDevFee as unknown as bigint | undefined,
        event.params.amount
      ),
    } as unknown as UserPairStatEntity;
    context.UserPairStat.set(ups ? { ...ups, ...upsUpdated } : upsUpdated);
  }

  // Update MetaData dev fee total
  const meta = await getMeta(context);
  const metaUpdated: MetaDataEntity = {
    ...meta,
    totalDevFee: add(
      meta.totalDevFee as unknown as bigint | undefined,
      event.params.amount
    ),
  } as unknown as MetaDataEntity;
  context.MetaData.set(metaUpdated);
});

// Similar pattern for other fee handlers...
OstiumTradingCallbacks.VaultOpeningFeeCharged.handler(
  async ({ event, context }) => {
    const userId = event.params.trader.toLowerCase();
    const user = await context.User.get(userId);
    const userUpdated: UserEntity = {
      id: userId,
      totalVaultFee: add(
        user?.totalVaultFee as unknown as bigint | undefined,
        event.params.amount
      ),
    } as unknown as UserEntity;
    context.User.set(user ? { ...user, ...userUpdated } : userUpdated);

    const meta = await getMeta(context);
    const metaUpdated: MetaDataEntity = {
      ...meta,
      totalVaultFee: add(
        meta.totalVaultFee as unknown as bigint | undefined,
        event.params.amount
      ),
    } as unknown as MetaDataEntity;
    context.MetaData.set(metaUpdated);
  }
);

OstiumTradingCallbacks.VaultLiqFeeCharged.handler(
  async ({ event, context }) => {
    const userId = event.params.trader.toLowerCase();
    const user = await context.User.get(userId);
    const userUpdated: UserEntity = {
      id: userId,
      totalLiquidationFee: add(
        user?.totalLiquidationFee as unknown as bigint | undefined,
        event.params.amount
      ),
      totalLIQOrders: add(
        user?.totalLIQOrders as unknown as bigint | undefined,
        1n
      ),
    } as unknown as UserEntity;
    context.User.set(user ? { ...user, ...userUpdated } : userUpdated);

    const meta = await getMeta(context);
    const metaUpdated: MetaDataEntity = {
      ...meta,
      totalLiquidationFee: add(
        meta.totalLiquidationFee as unknown as bigint | undefined,
        event.params.amount
      ),
      totalLIQOrders: add(
        meta.totalLIQOrders as unknown as bigint | undefined,
        1n
      ),
    } as unknown as MetaDataEntity;
    context.MetaData.set(metaUpdated);
  }
);

OstiumTradingCallbacks.OracleFeeCharged.handler(async ({ event, context }) => {
  const userId = event.params.trader.toLowerCase();
  const user = await context.User.get(userId);
  const userUpdated: UserEntity = {
    id: userId,
    totalOracleFee: add(
      user?.totalOracleFee as unknown as bigint | undefined,
      event.params.amount
    ),
  } as unknown as UserEntity;
  context.User.set(user ? { ...user, ...userUpdated } : userUpdated);

  const meta = await getMeta(context);
  const metaUpdated: MetaDataEntity = {
    ...meta,
    totalOracleFee: add(
      meta.totalOracleFee as unknown as bigint | undefined,
      event.params.amount
    ),
  } as unknown as MetaDataEntity;
  context.MetaData.set(metaUpdated);
});

// =====================
// VAULT HANDLERS
// =====================

OstiumVault.Deposit.handler(async ({ event, context }) => {
  // Update or create LpShare entity
  const userId = event.params.owner.toLowerCase();
  const existingShare = await context.LpShare.get(userId);
  const updatedShare: LpShareEntity = {
    id: userId,
    user: event.params.owner,
    assets: add(
      existingShare?.assets as unknown as bigint | undefined,
      event.params.assets
    ),
    shares: add(
      existingShare?.shares as unknown as bigint | undefined,
      event.params.shares
    ),
    lockedAssets: existingShare?.lockedAssets ?? 0n,
    lockedShares: existingShare?.lockedShares ?? 0n,
    hasLocked: existingShare?.hasLocked ?? false,
  } as unknown as LpShareEntity;
  context.LpShare.set(updatedShare);

  // Create LpAction record
  const actionEntity: LpActionEntity = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.owner,
    assets: event.params.assets,
    shares: event.params.shares,
    actionType: "deposit",
    timestamp: BigInt(event.block.timestamp),
    epoch: 0n,
    withdrawShares: 0n,
    withdrawRequestEpoch: 0n,
    withdrawUnlockEpoch: 0n,
  } as unknown as LpActionEntity;
  context.LpAction.set(actionEntity);

  // Update Vault totals
  const vaultId = "ostium_vault";
  const vault = await context.Vault.get(vaultId);
  const updatedVault: VaultEntity = {
    id: vaultId,
    assets: add(
      vault?.assets as unknown as bigint | undefined,
      event.params.assets
    ),
    shares: add(
      vault?.shares as unknown as bigint | undefined,
      event.params.shares
    ),
  } as unknown as VaultEntity;
  context.Vault.set(vault ? { ...vault, ...updatedVault } : updatedVault);
});

OstiumVault.Withdraw.handler(async ({ event, context }) => {
  // Update LpShare entity
  const userId = event.params.owner.toLowerCase();
  const existingShare = await context.LpShare.get(userId);
  if (existingShare) {
    const newAssets =
      (existingShare.assets as unknown as bigint) - event.params.assets;
    const newShares =
      (existingShare.shares as unknown as bigint) - event.params.shares;
    const updatedShare: LpShareEntity = {
      ...existingShare,
      assets: newAssets < 0n ? 0n : newAssets,
      shares: newShares < 0n ? 0n : newShares,
    } as unknown as LpShareEntity;
    context.LpShare.set(updatedShare);
  }

  // Create LpAction record
  const actionEntity: LpActionEntity = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.owner,
    assets: event.params.assets,
    shares: event.params.shares,
    actionType: "withdraw",
    timestamp: BigInt(event.block.timestamp),
    epoch: 0n,
    withdrawShares: 0n,
    withdrawRequestEpoch: 0n,
    withdrawUnlockEpoch: 0n,
  } as unknown as LpActionEntity;
  context.LpAction.set(actionEntity);

  // Update Vault totals
  const vaultId = "ostium_vault";
  const vault = await context.Vault.get(vaultId);
  if (vault) {
    const newAssets = (vault.assets as unknown as bigint) - event.params.assets;
    const newShares = (vault.shares as unknown as bigint) - event.params.shares;
    const updatedVault: VaultEntity = {
      ...vault,
      assets: newAssets < 0n ? 0n : newAssets,
      shares: newShares < 0n ? 0n : newShares,
    } as unknown as VaultEntity;
    context.Vault.set(updatedVault);
  }
});

OstiumVault.DepositLocked.handler(async ({ event, context }) => {
  const d = event.params._3;

  // Create LpNFT entity
  const nftId = event.params.depositId.toString();
  const nftEntity: LpNFTEntity = {
    id: nftId,
    user: event.params.owner,
    assetsDeposited: d[1],
    assetsDiscount: d[2],
    shares: d[3],
    atTime: BigInt(event.block.timestamp),
    lockDuration: d[4],
    isUnlocked: false,
  } as unknown as LpNFTEntity;
  context.LpNFT.set(nftEntity);

  // Update LpShare entity to track locked amounts
  const userId = event.params.owner.toLowerCase();
  const existingShare = await context.LpShare.get(userId);
  const updatedShare: LpShareEntity = {
    id: userId,
    user: event.params.owner,
    assets: existingShare?.assets ?? 0n,
    shares: existingShare?.shares ?? 0n,
    lockedAssets: add(
      existingShare?.lockedAssets as unknown as bigint | undefined,
      d[1]
    ),
    lockedShares: add(
      existingShare?.lockedShares as unknown as bigint | undefined,
      d[3]
    ),
    hasLocked: true,
  } as unknown as LpShareEntity;
  context.LpShare.set(updatedShare);

  // Create LpAction record
  const actionEntity: LpActionEntity = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.owner,
    assets: d[1],
    shares: d[3],
    actionType: "deposit_locked",
    timestamp: BigInt(event.block.timestamp),
    epoch: 0n,
    withdrawShares: 0n,
    withdrawRequestEpoch: 0n,
    withdrawUnlockEpoch: 0n,
  } as unknown as LpActionEntity;
  context.LpAction.set(actionEntity);

  // Update Vault locked users count
  const vaultId = "ostium_vault";
  const vault = await context.Vault.get(vaultId);
  const updatedVault: VaultEntity = {
    id: vaultId,
    totalLockedUsers: add(
      vault?.totalLockedUsers as unknown as bigint | undefined,
      1n
    ),
  } as unknown as VaultEntity;
  context.Vault.set(vault ? { ...vault, ...updatedVault } : updatedVault);
});

OstiumVault.DepositUnlocked.handler(async ({ event, context }) => {
  const d = event.params._4;

  // Update LpNFT entity to mark as unlocked
  const nftId = event.params.depositId.toString();
  const existingNft = await context.LpNFT.get(nftId);
  if (existingNft) {
    const updatedNft: LpNFTEntity = {
      ...existingNft,
      isUnlocked: true,
    } as unknown as LpNFTEntity;
    context.LpNFT.set(updatedNft);

    // Update LpShare entity to reduce locked amounts
    const userId = event.params.owner.toLowerCase();
    const existingShare = await context.LpShare.get(userId);
    if (existingShare) {
      const newLockedAssets =
        (existingShare.lockedAssets as unknown as bigint) - d[1];
      const newLockedShares =
        (existingShare.lockedShares as unknown as bigint) - d[3];
      const updatedShare: LpShareEntity = {
        ...existingShare,
        lockedAssets: newLockedAssets < 0n ? 0n : newLockedAssets,
        lockedShares: newLockedShares < 0n ? 0n : newLockedShares,
        hasLocked: newLockedAssets > 0n || newLockedShares > 0n,
      } as unknown as LpShareEntity;
      context.LpShare.set(updatedShare);
    }
  }

  // Create LpAction record
  const actionEntity: LpActionEntity = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    user: event.params.owner,
    assets: d[1],
    shares: d[3],
    actionType: "deposit_unlocked",
    timestamp: BigInt(event.block.timestamp),
    epoch: 0n,
    withdrawShares: 0n,
    withdrawRequestEpoch: 0n,
    withdrawUnlockEpoch: 0n,
  } as unknown as LpActionEntity;
  context.LpAction.set(actionEntity);
});

OstiumVault.ShareToAssetsPriceUpdated.handler(async ({ event, context }) => {
  // Update Vault share price, and write daily snapshot
  const vaultId = "ostium_vault";
  const vault = await context.Vault.get(vaultId);
  const updatedVault: VaultEntity = {
    id: vaultId,
    sharePrice: event.params.value,
  } as unknown as VaultEntity;
  context.Vault.set(vault ? { ...vault, ...updatedVault } : updatedVault);

  const day = toDayString(event.block.timestamp as unknown as bigint);
  const dailyId = `${day}`;
  const daily = await context.ShareToAssetsPriceDaily.get(dailyId);
  const dailyEntity: ShareToAssetsPriceDailyEntity = {
    id: dailyId,
    sharePrice: event.params.value,
    timestamp: BigInt(event.block.timestamp),
    day,
  } as unknown as ShareToAssetsPriceDailyEntity;
  context.ShareToAssetsPriceDaily.set(
    daily ? { ...daily, ...dailyEntity } : dailyEntity
  );
});

OstiumVault.AccPnlPerTokenUsedUpdated.handler(async ({ event, context }) => {
  // Update Vault entity
  const vaultId = "ostium_vault";
  const vault = await context.Vault.get(vaultId);
  const updatedVault: VaultEntity = {
    id: vaultId,
    accPnlPerTokenUsed: event.params.newAccPnlPerTokenUsed,
  } as unknown as VaultEntity;
  context.Vault.set(vault ? { ...vault, ...updatedVault } : updatedVault);
});

OstiumVault.RewardDistributed.handler(async ({ event, context }) => {
  // Update Vault rewards
  const vaultId = "ostium_vault";
  const vault = await context.Vault.get(vaultId);
  const updatedVault: VaultEntity = {
    id: vaultId,
    rewardsPerToken: event.params.accRewardsPerToken,
  } as unknown as VaultEntity;
  context.Vault.set(vault ? { ...vault, ...updatedVault } : updatedVault);
});

// NFT Transfer handler
OstiumLockedDepositNft.Transfer.handler(async ({ event, context }) => {
  // Update LpNFT owner on transfer (skip mint/burn with zero addresses)
  const nftId = event.params.tokenId.toString();
  const existingNft = await context.LpNFT.get(nftId);
  if (
    existingNft &&
    event.params.from !== "0x0000000000000000000000000000000000000000" &&
    event.params.to !== "0x0000000000000000000000000000000000000000"
  ) {
    const updatedNft: LpNFTEntity = {
      ...existingNft,
      user: event.params.to,
    } as unknown as LpNFTEntity;
    context.LpNFT.set(updatedNft);

    // Update LpShare entities for both old and new owners
    const oldUserId = event.params.from.toLowerCase();
    const newUserId = event.params.to.toLowerCase();

    // Remove from old owner
    const oldShare = await context.LpShare.get(oldUserId);
    if (oldShare) {
      const newOldLockedAssets =
        (oldShare.lockedAssets as unknown as bigint) -
        (existingNft.assetsDeposited as unknown as bigint);
      const newOldLockedShares =
        (oldShare.lockedShares as unknown as bigint) -
        (existingNft.shares as unknown as bigint);
      const updatedOldShare: LpShareEntity = {
        ...oldShare,
        lockedAssets: newOldLockedAssets < 0n ? 0n : newOldLockedAssets,
        lockedShares: newOldLockedShares < 0n ? 0n : newOldLockedShares,
        hasLocked: newOldLockedAssets > 0n || newOldLockedShares > 0n,
      } as unknown as LpShareEntity;
      context.LpShare.set(updatedOldShare);
    }

    // Add to new owner
    const newShare = await context.LpShare.get(newUserId);
    const updatedNewShare: LpShareEntity = {
      id: newUserId,
      user: event.params.to,
      assets: newShare?.assets ?? 0n,
      shares: newShare?.shares ?? 0n,
      lockedAssets: add(
        newShare?.lockedAssets as unknown as bigint | undefined,
        existingNft.assetsDeposited as unknown as bigint
      ),
      lockedShares: add(
        newShare?.lockedShares as unknown as bigint | undefined,
        existingNft.shares as unknown as bigint
      ),
      hasLocked: true,
    } as unknown as LpShareEntity;
    context.LpShare.set(updatedNewShare);
  }
});

// Last trade price handler
OstiumOpenPnl.LastTradePriceUpdated.handler(async ({ event, context }) => {
  const pairId = event.params.pairIndex.toString();
  const existing = await context.Pair.get(pairId);
  if (existing) {
    const updated: PairEntity = {
      ...existing,
      lastTradePrice: event.params.lastTradePrice,
    };
    context.Pair.set(updated);
  }
});
