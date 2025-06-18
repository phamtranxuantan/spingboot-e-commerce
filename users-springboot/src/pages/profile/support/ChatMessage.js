

const ChatMessage = ({ messages, selectedAdmin }) => {

  return (
    <div className="chat-container p-3">
      {/* Header hiển thị thông tin admin */}
      {selectedAdmin ? (
        <div className="d-flex align-items-center p-3 border-bottom">
          <img
            src={`http://localhost:8080/api/public/users/imageUser/${selectedAdmin.imageUser}`}
            alt="Admin Avatar"
            className="rounded-circle me-2 border"
            style={{ width: "40px", height: "40px", objectFit: "cover" }}
          />
          <span className="fw-bold text-dark">
            {selectedAdmin.lastName}{selectedAdmin.firstName}
          </span>
        </div>
      ) : (
        <div className="p-3 border-bottom">
          <h5 className="mb-0 text-muted">Chọn một admin để được hỗ trợ!!!</h5>
        </div>
      )}

      {/* Danh sách tin nhắn */}
      <div className="chat-messages p-3" style={{ maxHeight: "400px", overflowY: "auto" }}>
        {messages.map((message, index) => (
          <div
            key={message.id || `${message.sender}-${message.receiver}-${message.timestamp}-${index}`}
            className={`d-flex mb-3 ${message.isAdmin ? "justify-content-start" : "justify-content-end"}`}
          >
            <div
              className={`p-3 px-4 rounded shadow ${message.isAdmin ? "bg-primary text-white" : "bg-secondary text-light"}`}
              style={{ maxWidth: "75%", wordWrap: "break-word", overflow: "hidden", whiteSpace: "pre-wrap" }}
            >
              <p className="mb-0">{message.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
};
export default ChatMessage;