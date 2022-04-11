defmodule AudioNodeWeb.SignalChannel do
  use Phoenix.Channel

  def join("signal:"<>_user_id, _payload, socket) do
    {:ok, socket}
  end

  def terminate(_reason, %{assigns: %{user_id: user_id}}) do
    GenServer.call(ReadyState, {:remove_user, user_id}, :infinity)
    # |> broadcast_to_users()
  end

  def handle_in("sender-ready", %{"receiverUserId" => receiver_user_id}, socket) do
    GenServer.call(ReadyState, {:sender_ready, %{sender: socket.assigns.user_id, receiver: receiver_user_id}}, :infinity)
    |> maybe_kickoff_negotiation()
    {:noreply, socket}
  end

  def handle_in("receiver-ready", %{"senderUserId" => sender_user_id}, socket) do
    GenServer.call(ReadyState, {:receiver_ready, %{sender: sender_user_id, receiver: socket.assigns.user_id}}, :infinity)
    |> maybe_kickoff_negotiation()
    {:noreply, socket}
  end

  def handle_in("offer", %{"userId" => user_id, "offer" => offer}, socket) do
    AudioNodeWeb.Endpoint.broadcast_from!(self(), "signal:#{user_id}", "offer", %{from: socket.assigns.user_id, offer: offer})
    {:noreply, socket}
  end

  def handle_in("answer", %{"from" => from, "answer" => answer}, socket) do
    AudioNodeWeb.Endpoint.broadcast_from!(self(), "signal:#{from}", "answer", %{from: socket.assigns.user_id, answer: answer})
    {:noreply, socket}
  end

  def handle_in("ice-candidate", %{"userId" => user_id, "candidate" => candidate}, socket) do
    AudioNodeWeb.Endpoint.broadcast_from!(self(), "signal:#{user_id}", "ice-candidate", %{from: socket.assigns.user_id, candidate: candidate})
    {:noreply, socket}
  end

  def handle_in("connected", %{"senderUserId" => sender_user_id }, socket) do
    GenServer.call(ReadyState, {:connected, %{sender: sender_user_id, receiver: socket.assigns.user_id}}, :infinity)
    AudioNodeWeb.Endpoint.broadcast_from!(self(), "signal:#{sender_user_id}", "connected", %{from: socket.assigns.user_id})
    {:noreply, socket}
  end

  defp maybe_kickoff_negotiation(nil), do: nil
  defp maybe_kickoff_negotiation(%{sender: sender, receiver: receiver}) do
    IO.puts("SIGNALING: signal:#{sender} with Kickoff")
    # I really don't understand why this won't kickoff if receiver gets ready first, it puts but won't actually broadcast
    AudioNodeWeb.Endpoint.broadcast!("signal:#{sender}", "kickoff", %{receiver: receiver})
  end
end
