import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';

const WEBSOCKET_URL = 'http://localhost:8080/ws';

class WebSocketService {
  constructor() {
    this.stompClient = null;
  }

  connect() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(WEBSOCKET_URL),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Connected to WebSocket');
        
        // Subscribe to sensor updates
        this.stompClient.subscribe('/topic/sensor-updates', (msg) => {
          const data = JSON.parse(msg.body);
          useStore.getState().addSensorReading(data);
        });

        // Subscribe to alerts
        this.stompClient.subscribe('/topic/alerts', (msg) => {
          const text = msg.body;
          useStore.getState().addAlert(text);
          toast.error(text, { duration: 4000 });
        });

        // Subscribe to complaints
        this.stompClient.subscribe('/topic/complaints', (msg) => {
          const complaint = JSON.parse(msg.body);
          // Just refetching for simplicity instead of manual merge
          import('./api').then(({ fetchComplaints }) => {
              fetchComplaints().then(res => {
                  useStore.getState().setComplaints(res.data);
              });
          });
          toast.success(`Complaint status changed!`);
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
      },
    });

    this.stompClient.activate();
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }
}

const wsService = new WebSocketService();
export default wsService;
