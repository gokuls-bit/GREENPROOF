import numpy as np
import gymnasium as gym

class CarbonOptimizationEnv(gym.Env):
    def __init__(self):
        super().__init__()
        self.state_dim = 8
        self.action_dim = 5
        self.observation_space = gym.spaces.Box(low=0, high=1, shape=(self.state_dim,), dtype=np.float32)
        self.action_space = gym.spaces.Discrete(self.action_dim)
        self.max_steps = 100
        self.reset()

    def reset(self, seed=None, options=None):
        self.step_count = 0
        self.emission_total = np.random.uniform(50, 200)
        self.emission_categories = np.random.dirichlet(np.ones(3))
        self.operational_cost = np.random.uniform(1000, 5000)
        self.historical_reduction = np.random.uniform(0, 1)
        self.industry_encoding = np.random.randint(0, 5)
        return self._get_state(), {}

    def _get_state(self):
        state = np.array([
            self.emission_total / 200.0,
            *self.emission_categories,
            self.operational_cost / 5000.0,
            self.historical_reduction,
            self.industry_encoding / 4.0,
            self.step_count / self.max_steps,
        ], dtype=np.float32)
        return state

    def step(self, action):
        emission_reduction = 0.0
        strategy_cost = 0.0
        compliance_score = 0.0
        if action == 0:
            emission_reduction = np.random.uniform(5, 15)
            strategy_cost = np.random.uniform(200, 500)
            compliance_score = 0.7
        elif action == 1:
            emission_reduction = np.random.uniform(3, 10)
            strategy_cost = np.random.uniform(100, 300)
            compliance_score = 0.6
        elif action == 2:
            emission_reduction = np.random.uniform(10, 25)
            strategy_cost = np.random.uniform(500, 1000)
            compliance_score = 0.9
        elif action == 3:
            emission_reduction = np.random.uniform(2, 8)
            strategy_cost = np.random.uniform(50, 200)
            compliance_score = 0.5
        elif action == 4:
            emission_reduction = 0.0
            strategy_cost = 0.0
            compliance_score = 0.3
        self.emission_total = max(0, self.emission_total - emission_reduction)
        self.operational_cost += strategy_cost
        self.historical_reduction = 0.9 * self.historical_reduction + 0.1 * (emission_reduction / 25.0)
        reward = (
            emission_reduction
            - strategy_cost / 1000.0
            + compliance_score
        )
        self.step_count += 1
        done = self.step_count >= self.max_steps or self.emission_total <= 0
        return self._get_state(), reward, done, False, {}
