// Importing necessary modules and functions
const { fetchUserData,fetchUserComments,fetchPosts } = require('./api');
const UserProfile = require('./models/userProfile');
import fs from 'fs';

// Function to build a user profile
async function buildUserProfile(username) {
    const userData = await fetchUserData(username);
    const userProfile = new UserProfile(userData);
    

    const userPosts = await fetchPosts(username);
    
    userPosts.originalPostsInfo.forEach(postData => userProfile.addPost(postData));

   
    userPosts.sharedPostsInfo.forEach(sharedPostData => userProfile.addSharedPost(sharedPostData));

    const userComments = await fetchUserComments(username);
    userComments.forEach(commentData => userProfile.addComment(commentData));

    return userProfile;
}







import ThreadsAPI from 'threads-api';

const threadsAPI = new ThreadsAPI.ThreadsAPI();



async function main() {
    const username = 'nehorai_hagag';
    const activities = await fetchUserActivities(username);
    activities.forEach(activity => console.log(JSON.stringify(activity, null, 2)));
}

main().catch(console.error);

/*
// Main function to execute the application logic
async function main() {
    try {
        const username = 'nehorai_hagag'; // Replace with actual username
        const userProfile = await buildUserProfile(username);

        // Output the complete user profile
        console.log(JSON.stringify(userProfile, null, 2));
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// Execute the main function
main();
*/