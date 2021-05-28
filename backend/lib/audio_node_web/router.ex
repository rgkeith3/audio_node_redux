defmodule AudioNodeWeb.Router do
  use AudioNodeWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", AudioNodeWeb do
    pipe_through :api
  end
end
