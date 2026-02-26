import numpy as np
import gymnasium as gym

class CarbonTradingEnv(gym.Env):
    def __init__(self):
        super().__init__()
        self.state_dim = 14
        self.action_dim = 3
        self.observation_space = gym.spaces.Box(low=0, high=1, shape=(self.state_dim,), dtype=np.float32)
        self.action_space = gym.spaces.Discrete(self.action_dim)
        self.window_size = 10
        self.max_steps = 200
        self.reset()

    def reset(self, seed=None, options=None):
        self.step_count = 0
        self.price_history = np.random.uniform(10, 50, self.window_size).tolist()
        self.portfolio_balance = np.random.uniform(1000, 5000)
        self.emission_surplus = np.random.uniform(-50, 50)
        self.regulatory_risk = np.random.uniform(0, 1)
        self.position = 0
        return self._get_state(), {}

    def _get_state(self):
        prices = np.array(self.price_history[-self.window_size:], dtype=np.float32) / 100.0
        volatility = float(np.std(self.price_history[-self.window_size:]) / 10.0)
        state = np.concatenate([
            prices,
            [volatility, self.emission_surplus / 100.0, self.regulatory_risk, self.portfolio_balance / 5000.0],
        ]).astype(np.float32)
        return state

    def step(self, action):
        current_price = self.price_history[-1]
        new_price = current_price * np.random.uniform(0.95, 1.05)
        self.price_history.append(new_price)
        realized_profit = 0.0
        compliance_stability = 0.0
        volatility_penalty = float(np.std(self.price_history[-self.window_size:]))
        if action == 0:
            trade_size = min(100, self.portfolio_balance / new_price)
            self.portfolio_balance -= trade_size * new_price
            self.position += trade_size
            compliance_stability = 0.6 if self.emission_surplus < 0 else 0.3
        elif action == 1:
            if self.position > 0:
                trade_size = min(self.position, 50)
                realized_profit = trade_size * (new_price - current_price)
                self.portfolio_balance += trade_size * new_price
                self.position -= trade_size
                compliance_stability = 0.7 if self.emission_surplus > 0 else 0.4
            else:
                compliance_stability = 0.2
        elif action == 2:
            compliance_stability = 0.5
        self.emission_surplus += np.random.uniform(-5, 5)
        self.regulatory_risk = np.clip(self.regulatory_risk + np.random.uniform(-0.05, 0.05), 0, 1)
        reward = (
            realized_profit / 100.0
            + compliance_stability
            - (volatility_penalty / 10.0)
            - self.regulatory_risk * 0.2
        )
        self.step_count += 1
        done = self.step_count >= self.max_steps
        return self._get_state(), reward, done, False, {}
