/* eslint-disable react/prop-types */
import { Avatar, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { dataProvider } from "../../dataProvider";

interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUser: string;
}

const Sidebar = ({ setselectedUser }: { setselectedUser: (user: User) => void }) => {

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await dataProvider.getList("adminChatUsers", {});

        if (Array.isArray(response.data)) {
          const validUsers = response.data.map((user) => {
            if (user.email && typeof user.email === "object") {
              return {
                userId: user.email.userId,
                firstName: user.email.firstName,
                lastName: user.email.lastName,
                email: user.email.email,
                imageUser: user.email.imageUser,
              };
            }
            return {
              userId: user.userId,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              imageUser: user.imageUser,
            };
          });
          setUsers(validUsers);
        } else {
          console.error("Dữ liệu API không hợp lệ:", response.data);
          setUsers([]);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        setUsers([]);
      }
    };

    fetchUsers();
  }, []);

  const handleClickChangeUser = (user: User) => {
    setselectedUser(user);
  };

  return (
    <List>
      <Typography variant="h6" gutterBottom>
        Hỗ trợ
      </Typography>
      {users.length > 0 ? (
        users.map((user, index) => (
          <ListItem
            key={user.userId || `user-${index}`}
            button
            onClick={() => handleClickChangeUser(user)}
          >
            <Avatar
              src={
                user.imageUser
                  ? `http://localhost:8080/api/public/users/imageUser/${user.imageUser}`
                  : ""
              }
              alt={user.firstName || "Người dùng"}
            />
            <ListItemText
              primary={`${user.firstName || "Không có tên"} ${user.lastName || ""}`}
              secondary={user.email || "Không có email"}
              style={{ marginLeft: "10px" }}
            />
          </ListItem>
        ))
      ) : (
        <Typography variant="body2" style={{ padding: "10px", color: "#888" }}>
          Không có người dùng nào.
        </Typography>
      )}
    </List>
  );
};

export default Sidebar;
