import styles from './UserList.module.css';

type Props = {
  users: {username: string, avatar: string;}[];
}


export const UserList = ({users}:Props) => {
  return (
    <div className={styles.userlist}>
      <h2 className='font-bold text-center'>- User List -</h2>
      {users.length > 0 ? (
        <ul className="list">
          {users.map((user) => (
            <li className="list-row" key={user.username}>
              <div className="avatar">
                <div className="w-5 rounded-full">
                  <img src={user.avatar} alt={user.username} />
                </div>
              </div>
              {user.username}
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
}