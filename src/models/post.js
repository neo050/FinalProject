class Post {
    constructor(postData) {
        this.id = postData.id;
        this.content = postData.content;
        this.likes = postData.likes;
        this.shares = postData.shares;
        this.comments = postData.comments.map(comment => new Comment(comment));
    }
}

module.exports = Post;
