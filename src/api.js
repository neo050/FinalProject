import APIClient from "threads-api";
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: './My.env' });

// Initialize the Threads API client
const threadsAPI = new APIClient.ThreadsAPI({
    username: process.env.THREADS_API_USERNAME, // Your environment variable for username
    password: process.env.THREADS_API_PASSWORD, // Your environment variable for password
    deviceID: 'android-2a2fz9pk7phc00000'
  });


  async function fetchUserData(username) {
    const userID = await threadsAPI.getUserIDfromUsername(username);
    if (!userID) {
        throw new Error(`User ID not found for username: ${username}`);
    }
    return await threadsAPI.getUserProfile(username, userID);
}





async function fetchPosts(username) {
    // Get user ID from username
    const userID = await threadsAPI.getUserIDfromUsername(username);
    if (!userID) {
        throw new Error(`User ID not found for username: ${username}`);
    }
    // Fetch user's threads
    const userProfileThreads = await threadsAPI.getUserProfileThreads(userID);

    // Lists to hold information about shared and original posts
    const sharedPostsInfo = [];
    const originalPostsInfo = [];

    // Process each thread to categorize posts
    userProfileThreads.forEach(threadItem => {
        threadItem.thread_items.forEach(post => {
            const postDetails = post.post;
            const shareInfo = postDetails.text_post_app_info?.share_info;

            // Common post information
            const postInfo = {
                username: postDetails.user.username,
                profile_pic_url: postDetails.user.profile_pic_url,
                caption: postDetails.caption ? postDetails.caption.text : '',
                taken_at: postDetails.taken_at,
                like_count: postDetails.like_count,
            };

            // Check if the post is shared
            if (shareInfo && (shareInfo.is_reposted_by_viewer || Boolean(shareInfo.reposted_post))) {
                sharedPostsInfo.push({ ...postInfo, isShared: true });
            } else {
                // Treat as an original post
                originalPostsInfo.push({ ...postInfo, isShared: false });
            }
        });
    });

    return { sharedPostsInfo, originalPostsInfo };
}




async function fetchUserComments(username) {
    const userID = await threadsAPI.getUserIDfromUsername(username);

    // Fetch posts and replies by the user
    const replies = await threadsAPI.getUserProfileReplies(userID);

    const userCommentsInfo = [];

    // Process and add replies to activities
    replies.forEach(reply => {
        reply.thread_items.forEach(item => {
            const comment = item.post;
            userCommentsInfo.push({
                type: 'reply',
                replyId: reply.id,
                itemId: comment.id,
                content: comment.text_post_app_info, // Adjust based on actual content structure
                authorUsername: comment.user.username,
                authorDisplayName: comment.user.full_name,
                authorProfilePic: comment.user.profile_pic_url,
                authorVerified: comment.user.is_verified,
                likeCount: comment.like_count,
                replyCount: comment.text_post_app_info.direct_reply_count, // Directly from TextPostAppInfo
                shareCount: comment.text_post_app_info.share_info.can_repost ? 'Share count not directly available' : 'Not sharable', // Indirect indication
                mediaAttachments: comment.image_versions2.candidates.map(c => c.url), // Directly from ImageVersions2
                hashtags: extractHashtags(comment.caption?.text), // Assuming a function to extract hashtags
                mentions: extractMentions(comment.caption?.text), // Assuming a function to extract mentions
                inResponseTo: comment.text_post_app_info.reply_to_author ? comment.text_post_app_info.reply_to_author.username : null,
                postType: comment.media_type, // Directly from Post
                locationTag: 'Location tag not directly available', // No direct field
                timeZone: 'Time zone information not directly available', // No direct field for exact time zone
                localTimeOfPosting: new Date(comment.taken_at * 1000).toLocaleString(), // Convert Unix timestamp to local time
                altTextForImages: 'Alt text for images not directly available', // No direct field
                isEditable: 'Editability not directly available', // No direct field
                clickableURLs: extractURLs(comment.caption?.text) // Assuming a function to extract URLs
                // Add more details as needed
            });
        });
    });

    return userCommentsInfo;
}
function extractHashtags(text) {
    const hashtagRegex = /#[\w]+/g;
    return text.match(hashtagRegex) || [];
}

function extractMentions(text) {
    const mentionRegex = /@[\w]+/g;
    return text.match(mentionRegex) || [];
}

function extractURLs(text) {
    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig;
    return text.match(urlRegex) || [];
}




export { fetchUserData, fetchPosts, fetchUserComments };

