import Link from "next/link";
const UserComponet = ({ user ,onClose }) => {
  return (
    <Link href={`/message/${user._id}`} onClick={onClose}>
      <div className="h-12">
        <p className="text-center text-lg text-slate-400">{user.name}</p>
      </div>
    </Link>
  );
};

export default UserComponet;
