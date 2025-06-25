"use server";
import v2 from "@/lib/cloudinary";
import User from "@/models/User";
import { unstable_cache } from "next/cache";
import connectDB from "./mongoose";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { encrypt } from "@/lib/session";
import { cookies } from "next/headers";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import mongoose from "mongoose";

export async function seenMessage(sender, receiver) {
  await connectDB();
  const conversation = await Conversation.findOne({
    $or: [
      { sender: sender, receiver: receiver },
      { sender: receiver, receiver: sender },
    ],
  });
  if (!conversation) {
    return false;
  }
  let lastMessage = conversation.messages[conversation.messages.length - 1];
  const message = await Message.findOne({ _id: lastMessage });
  if (String(message.sender) === String(sender)) {
    return false;
  }
  if (message.seen === false) {
    message.seen = true;
    await message.save();
    return true;
  }
  return false;
}

export async function getAllConversations(id) {
  await connectDB();
  const conversations = await Conversation.find({
    $or: [{ sender: id }, { receiver: id }],
  })
    .select("-__v")
    .sort({ updatedAt: -1 });
  console.log("conversations",conversations);
  const arr = await Promise.all(
    conversations.map(async (conversation) => {
      let obj = conversation.toJSON();
      console.log("obj start",obj);
      const lastMessage =
        conversation.messages[conversation.messages.length - 1];
      obj.lastMessageID = lastMessage.toString();
      obj.id = String(obj._id);
      obj.sender = String(obj.sender);
      obj.receiver = String(obj.receiver);
      let message = await Message.findOne({ _id: obj.lastMessageID });
      obj.lastMessage =
        message.text || (message.url ? message.type : undefined);
      obj.sendMessage = String(message.sender);
      obj.seen = message.seen;
      delete obj.messages;
      delete obj._id;
      console.log("obj end",obj);
      return obj;
    })
  );
  console.log("arr ",arr);
  return arr;
}
export async function updateUser(prev, formData) {
  await connectDB();
  const user = await User.findById(formData.get("id"));
  if (!user) {
    return;
  }
  user.name = formData.get("name");
  user.profile_picture = formData.get("profile_picture");
  await user.save();
}
export async function sendMessage(formData) {
  const messageText = formData.get("message");
  const file = formData.get("URL");
  const type = formData.get("type");
  const sender = formData.get("sender");
  const reciver = formData.get("reciver");
  const senderId = new mongoose.Types.ObjectId(sender);
  const reciverId = new mongoose.Types.ObjectId(reciver);

  if (!messageText && !file) {
    return {
      Message: "Message is required",
    };
  }
  await connectDB();
  let conversation = await Conversation.findOne({
    $or: [
      { sender: senderId, receiver: reciverId },
      { sender: reciverId, receiver: senderId },
    ],
  });
  if (!conversation) {
    conversation = new Conversation({
      sender: senderId,
      receiver: reciverId,
    });
    await conversation.save();
  }
  const message = new Message({
    sender: sender,
    text: messageText,
    url: file,
    type: type,
  });
  await message.save();
  conversation.messages.push(message._id);
  await conversation.save();
}
export async function register(prevState, formData) {
  await connectDB();
  const cookieStore = await cookies();
  const user = await User.findOne({ email: formData.email });
  if (user) {
    return {
      Email: "Email already exists",
    };
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(formData.get("password"), salt);
  const file = formData.get("profile_picture");
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const mimeType = file.type;
  const dataUri = `data:${mimeType};base64,${base64}`;
  const result = await v2.uploader.upload(dataUri, {
    resource_type: "auto",
    folder: "ChatApp/User",
    allowed_formats: ["jpg", "png", "jpeg"],
  });
  const newUser = new User({
    name: formData.get("name"),
    email: formData.get("email"),
    password: hash,
    profile_picture: result.secure_url,
  });
  const tokenData = {
    email: formData.get("email"),
    name: formData.get("name"),
    id: String(newUser._id),
  };

  const token = await encrypt(tokenData);
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  await newUser.save();
  redirect("/home");
}

export async function checkMail(prevState, formData) {
  await connectDB();
  const user = await User.findOne({ email: formData.get("email") });
  if (!user) {
    return {
      Email: "Email not found",
    };
  }
  const userInfo = {
    email: formData.get("email"),
    name: user.name,
    id: String(user._id),
    profile_picture: user.profile_picture,
  };
  const cookieStore = await cookies();
  cookieStore.set("userInfo", JSON.stringify(userInfo), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  redirect("/password");
}

export async function login(prevState, formData) {
  await connectDB();
  const cookieStore = await cookies();
  const user = await User.findOne({ email: formData.get("email") });
  const password = await bcrypt.compare(
    formData.get("password"),
    user.password
  );

  if (!password) {
    return {
      Password: "Password is incorrect",
    };
  }
  const tokenData = {
    email: formData.get("email"),
    name: formData.get("name"),
    id: String(user._id),
  };

  const token = await encrypt(tokenData);
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  redirect("/home");
}

export async function logout(prevState, formData) {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  cookieStore.delete("userInfo");
  redirect("/login");
}
export const getUser = async (id) => {
  await connectDB();
  const user = await User.findOne({ _id: id }).select("-password");
  let obj = user.toJSON();
  obj._id = String(obj._id);
  return obj;
};
export const getAllMessages = async (sender, receiver) => {
  await connectDB();
  const conversation = await Conversation.findOne({
    $or: [
      { sender: sender, receiver: receiver },
      { sender: receiver, receiver: sender },
    ],
  });
  if (!conversation) {
    return [];
  }
  const allMessageIds = conversation.messages;
  const messages = await Message.find({
    _id: { $in: allMessageIds },
  }).select("-__v");

  const messagesArray = messages.map((message) => {
    const obj = message.toJSON();
    obj._id = String(obj._id);
    obj.sender = String(obj.sender);
    return obj;
  });
  return messagesArray;
};

export const getAllUsers = unstable_cache(
  async () => {
    await connectDB();
    const users = await User.find().select("-password ");
    const usersArray = users.map((user) => {
      const obj = user.toJSON();
      obj._id = String(obj._id);
      return obj;
    });

    return usersArray;
  },
  [],
  {
    tags: ["ALLuser"],
  }
);

// export const getUsersByName = unstable_cache(
//   async (name) => {
//     console.log("object name", name);
//     await connectDB();
//     const users = await User.find({ name: { $regex: name, $options: "i" } }).select("-password ");
//     const usersArray = users.map((user) => {
//       const obj = user.toJSON();
//       obj._id = String(obj._id);
//       return obj;
//     });
//     return usersArray;
//   },
//   [],
//   {
//     tags: ["NameUsers"],
//   }
// );

export const getUsersByName = async (name, id) => {
  await connectDB();

  const users = await User.find({
    $and: [
      {
        $or: [
          { name: { $regex: name, $options: "i" } },
          { email: { $regex: name, $options: "i" } },
        ],
      },
      { _id: { $ne: id } }, // ✅ exclude self
    ],
  }).select("-password");
  const usersArray = users.map((user) => {
    const obj = user.toJSON();
    obj._id = String(obj._id);
    return obj;
  });
  return usersArray;
};

export const getUsersById = async (id) => {
  await connectDB();

  const user = await User.findOne({
    _id: id,
  }).select("-password");

  let obj = user.toJSON();

  obj.id = String(obj._id);
  delete obj._id;
  return obj;
};

// export async function getUser(id) {
//   await connectDB();
//   const user = await User.findOne({ _id: id }).select("-password");
//   let obj = user.toJSON();
//   obj._id = String(obj._id);
//   return obj;
// }
