defmodule AudioNodeWeb.ReadyState do
  defmodule ReadyStateOptions do
    defstruct [sender_ready: false, receiver_ready: false, connection_status: :waiting]
  end
  use GenServer

  def start_link(_) do
    GenServer.start_link(__MODULE__, [], name: ReadyState)
  end

  def init(_) do
    {:ok, %{connections: %{}, user_connections: %{}}}
  end

  def handle_call({:remove_user, user_id}, _from, %{connections: connections, user_connections: user_connections}) do
    user_involved_connections =
      user_connections
      |> Map.get(user_id, MapSet.new())

    new_connections =
      user_involved_connections
      |> Enum.reduce(connections, &remove_user_connection/2)

    new_user_connections =
      user_connections
      |> Map.delete(user_id)

    {:reply, user_involved_connections, %{connections: new_connections, user_connections: new_user_connections}}
  end

  def handle_call({:connected, key}, _from, %{connections: connections, user_connections: user_connections}) do
    new_connection_state =
      connections
      |> Map.get(key)
      |> Map.put(:connection_status, :connected)

    new_connections = Map.put(connections, key, new_connection_state)
    {:noreply, %{connections: new_connections, user_connections: user_connections}}
  end

  def handle_call({participant_ready, key}, _from, %{connections: connections, user_connections: user_connections}) do
    new_connections = set_ready(connections, key, participant_ready)
    new_user_connections = update_user_connections(user_connections, key)

    resp = if is_ready?(new_connections[key]) do
      key
    else
      nil
    end

    {:reply, resp, %{connections: new_connections, user_connections: new_user_connections}}
  end

  defp remove_user_connection(connections, conn_to_remove) do
    connections
    |> Map.delete(conn_to_remove)
  end

  defp update_user_connections(user_connections, %{receiver: receiver, sender: sender} = key) do
    reciever_conn_set =
      user_connections
      |> update_user_conn_set(receiver, key)

    sender_conn_set =
      user_connections
      |> update_user_conn_set(sender, key)

    user_connections
    |> Map.put(receiver, reciever_conn_set)
    |> Map.put(sender, sender_conn_set)
  end

  defp update_user_conn_set(user_connections, user, key) do
    user_connections
    |> Map.get(user, MapSet.new())
    |> MapSet.put(key)
  end

  defp set_ready(state, key, participant_ready) do
    ready_state =
      state
      |> Map.get(key, %ReadyStateOptions{})
      |> Map.put(participant_ready, true)

    Map.put(state, key, ready_state)
  end

  defp is_ready?(%{sender_ready: true, receiver_ready: true}), do: true
  defp is_ready?(_), do: false
end
