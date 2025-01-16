import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import matplotlib.pyplot as plt

# 下载标普500、QQQ、VTV 的历史数据
tickers = ['VOO', 'QQQ', 'VTV']
data = {}
for ticker in tickers:
    data[ticker] = yf.download(ticker, start="2020-01-01", end="2024-12-31")

# 整理数据
for ticker in tickers:
    data[ticker] = data[ticker]['Close']

# 合并数据
prices = pd.DataFrame(data)
returns = prices.pct_change()  # 每日收益率

# 策略参数
initial_investment = 30000  # 初始投资
monthly_investment = 2000   # 每月定投金额
additional_investment = 2000  # 额外增持金额
rebalance_month = 8         # 每年 8 月再平衡
weights = {'VOO': 0.5, 'QQQ': 0.3, 'VTV': 0.2}  # 再平衡权重
cash = initial_investment
positions = {'VOO': 0, 'QQQ': 0, 'VTV': 0}  # 起始持仓
portfolio_value = []
dates = []
monthly_invested = False

# 回测主逻辑
for date, row in prices.iterrows():
    # 每日投资组合价值
    value = sum(positions[t] * row[t] for t in tickers) + cash
    portfolio_value.append(value)
    dates.append(date)

    # 检查每月是否定投
    if date.day == 15 and not monthly_invested:
        if returns.loc[date, 'VOO'] < -0.01:  # 如果 VOO 单日跌幅超过 -1%，定投
            shares = monthly_investment / row['VOO']
            positions['VOO'] += shares
            cash -= monthly_investment
            monthly_invested = True

    # 检查月跌幅
    if date.day == 1:
        monthly_invested = False  # 重置每月定投状态
        if (row['VOO'] / prices.loc[date - timedelta(days=30), 'VOO'] - 1) < -0.05:  # 如果月跌幅超过 -5%
            shares = additional_investment / row['VOO']
            positions['VOO'] += shares
            cash -= additional_investment

    # 每年 8 月再平衡
    if date.month == rebalance_month and date.day == 15:
        total_value = sum(positions[t] * row[t] for t in tickers) + cash
        for t in tickers:
            target_value = total_value * weights[t]
            current_value = positions[t] * row[t]
            delta = target_value - current_value
            if delta > 0:  # 需要增持
                shares = delta / row[t]
                positions[t] += shares
                cash -= delta
            else:  # 需要减持
                shares = abs(delta) / row[t]
                positions[t] -= shares
                cash += abs(delta)

# 计算最终结果
portfolio = pd.DataFrame({'Date': dates, 'Portfolio Value': portfolio_value}).set_index('Date')

# 可视化
plt.figure(figsize=(10, 6))
plt.plot(portfolio, label="Portfolio Value")
plt.title("Portfolio Value Over Time")
plt.xlabel("Date")
plt.ylabel("Portfolio Value (USD)")
plt.legend()
plt.grid()
plt.show()