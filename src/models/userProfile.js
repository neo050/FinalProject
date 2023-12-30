class UserProfile {
    constructor(userData) {
        this.username = userData.username;
        this.posts = [];
        this.sharedPosts = [];
        this.comments = [];
    }

    addPost(postData) {
        this.posts.push(new Post(postData));
    }

    addSharedPost(sharedPostData) {
        this.sharedPosts.push(new Post(sharedPostData));
    }

    addComment(commentData) {
        this.comments.push(new Comment(commentData));
    }
}

module.exports = UserProfile;
