defmodule AudioNodeWeb.ReadyState do
  defmodule ReadyStateOptions do
    defstruct [sender_ready: false, receiver_ready: false]
  end
  use GenServer

  def start_link(_) do
    GenServer.start_link(__MODULE__, [], name: ReadyState)
  end

  def init(_) do
    {:ok, %{}}
  end

  def handle_call({participant_ready, key}, _from, state) do
    new_state = set_ready(state, key, participant_ready)

    resp = if is_ready?(new_state[key]) do
      key
    else
      nil
    end

    {:reply, resp, new_state}
  end

  defp set_ready(state, key, participant_ready) do
    ready_state =
      (state[key] || %ReadyStateOptions{})
      |> Map.put(participant_ready, true)

    Map.put(state, key, ready_state)
  end

  defp is_ready?(%{sender_ready: true, receiver_ready: true}), do: true
  defp is_ready?(_), do: false
end
