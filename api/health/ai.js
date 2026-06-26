const PROVIDER_DEFAULT_MODELS = {
  openrouter: 'nvidia/nemotron-nano-9b-v2:free',
  mistral: 'mistral-small-latest',
  cerebras: 'gpt-oss-120b',
  groq: 'llama-3.1-8b-instant',
}

const PROVIDER_KEY_ENVS = {
  openrouter: 'OPENROUTER_API_KEY',
  mistral: 'MISTRAL_API_KEY',
  cerebras: 'CEREBRAS_API_KEY',
  groq: 'GROQ_API_KEY',
}

function providerChain() {
  const providers = (process.env.LLM_PROVIDER_CHAIN || 'openrouter,mistral,cerebras,groq')
    .split(',')
    .map(item => item.trim().toLowerCase())
    .filter(Boolean)

  return [...new Set(providers)].map((provider, index) => {
    const keyEnv = PROVIDER_KEY_ENVS[provider]
    return {
      priority: index + 1,
      provider,
      model: process.env[`${provider.toUpperCase()}_MODEL`] || PROVIDER_DEFAULT_MODELS[provider],
      configured: Boolean(keyEnv && process.env[keyEnv]),
    }
  })
}

export default function handler(_req, res) {
  const chain = providerChain()
  res.status(200).json({
    status: 'ok',
    runtime: 'vercel-serverless',
    llm_configured: chain.some(item => item.configured),
    provider_chain: chain,
    note: 'This endpoint checks the Vercel demo AI proxy, not the full FastAPI data-agent backend.',
  })
}
