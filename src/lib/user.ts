import clientPromise from "./db";

export async function getUserList() {
  try {
    const client = await clientPromise;
    const db = client.db("sample_mflix");

    const users = await db
      .collection("users")
      .find({})
      .limit(13)
      .toArray();

      console.log(users);
    return {
      users: JSON.parse(JSON.stringify(users))
    };
  } catch (e) {
    console.error(e);
    return {
      users: []
    };
  }
}