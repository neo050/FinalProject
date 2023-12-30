import APIClient from "threads-api";

const threadsAPI = new APIClient.ThreadsAPI({
    username: process.env.THREADS_API_USERNAME, // Your environment variable for username
    password: process.env.THREADS_API_PASSWORD, // Your environment variable for password
    deviceID: 'android-2a2fz9pk7phc00000'
  });
async function fetchUserActivities(username) {
    const userID = await threadsAPI.getUserIDfromUsername(username);

    // Fetch posts and replies by the user
    const posts = await threadsAPI.getUserProfileThreads(userID);
    const replies = await threadsAPI.getUserProfileReplies(userID);

    // Possible exploration for activity data
    const activities = [];

    // Add posts to activities
    posts.forEach(post => activities.push({ type: 'post', data: post }));

    // Add replies to activities
    replies.forEach(reply => activities.push({ type: 'reply', data: reply }));

    // Further exploration for likes, comments, etc.
    // ...

    return activities;
}

async function main() {
    const username = 'zuck';
    const activities = await fetchUserActivities(username);
    console.log(activities);
}

main().catch(console.error);
