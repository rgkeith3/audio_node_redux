defmodule AudioNode.Repo do
  use Ecto.Repo,
    otp_app: :audio_node,
    adapter: Ecto.Adapters.Postgres
end
