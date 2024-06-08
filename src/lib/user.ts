import clientPromise from "./db";

export async function getUserList() {
  try {
    const client = await clientPromise;
    const db = client.db("sample_mflix");

    const users = await db
      .collection("users")
      .find({})
      .limit(10)
      .toArray();

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