import DiscussionForumHeader from "./DiscussionForumHeader";
import DiscussionForumPosting from "./DiscussionForumPosting";

const DiscussionForum = () => {
	return (
		<div className="sm:w-9/12 mx-auto">
			<DiscussionForumHeader />
			<DiscussionForumPosting />
		</div>
	);
};

export default DiscussionForum;
