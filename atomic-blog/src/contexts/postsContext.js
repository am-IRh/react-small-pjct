import { faker } from "@faker-js/faker"
import { createContext, useContext, useState } from "react"

function createRandomPost() {
	return {
		title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
		body: faker.hacker.phrase(),
	}
}

const PostContext = createContext()

function PostProvider({ children }) {
	const [posts, setPosts] = useState(() =>
		Array.from({ length: 30 }, () => createRandomPost()),
	)
	const [searchQuery, setSearchQuery] = useState("")

	const searchedPosts =
		searchQuery.length > 0
			? posts.filter(post => {
					return `${post.title} ${post.body}`
						.toLowerCase()
						.includes(searchQuery.toLowerCase())
			  })
			: posts

	function handleAddPost(post) {
		setPosts(posts => [post, ...posts])
	}

	function handleClearPosts() {
		setPosts([])
	}

	return (
		<PostContext.Provider
			value={{
				posts: searchedPosts,
				onAddPost: handleAddPost,
				onClearPosts: handleClearPosts,
				searchQuery,
				setSearchQuery,
			}}
		>
			{children}
		</PostContext.Provider>
	)
}

const usePosts = () => {
	const context = useContext(PostContext)

	if (context === undefined) {
		new Error("can't usePost outside of this provider, so before use PostProvider")
	}

	return context
}

export { PostProvider, usePosts }
