'use client';

import { useState } from 'react';
import { mockContacts } from '@/modules/dashboard/mock/contacts';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Reply {
  id: string;
  author: string;
  avatar?: string;
  message: string;
}

interface Comment {
  id: string;
  author: string;
  authorAvatar?: string;
  date: Date;
  message: string;
  replies: Reply[];
}

export function CompanyExtendedComments() {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'John Doe',
      authorAvatar: '/media/avatars/300-3.png',
      date: new Date('2025-07-21T10:00:00'),
      message:
        'Great progress on this deal! Let me know if you need any assistance.',
      replies: [
        {
          id: '1-1',
          author: 'Jane Smith',
          avatar: '/media/avatars/300-2.png',
          message: 'Thanks! I appreciate the support.',
        },
      ],
    },
    {
      id: '2',
      author: 'Mike Johnson',
      authorAvatar: '/media/avatars/300-1.png',
      date: new Date('2025-07-21T11:30:00'),
      message: "Don't forget to include the analytics dashboard in the demo.",
      replies: [
        {
          id: '2-1',
          author: 'Jane Smith',
          avatar: '/media/avatars/300-2.png',
          message: "Good point! I'll make sure it's ready.",
        },
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState('');

  const currentUser = mockContacts[0] || { name: 'User', avatar: '' };

  const formatDate = (date: Date) => format(date, 'PPP');

  const handleAdd = () => {
    if (!input.trim()) return;
    setTimeout(() => {
      const newComment: Comment = {
        id: Date.now().toString(),
        author: currentUser.name,
        authorAvatar: currentUser.avatar,
        date: new Date(),
        message: input.trim(),
        replies: [],
      };
      setComments([newComment, ...comments]);
      setInput('');
    }, 300);
  };

  const handleReplyAdd = (commentId: string) => {
    if (!replyInput.trim()) return;
    const reply: Reply = {
      id: Date.now().toString(),
      author: currentUser.name,
      avatar: currentUser.avatar,
      message: replyInput.trim(),
    };
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? { ...comment, replies: [...comment.replies, reply] }
          : comment,
      ),
    );
    setReplyInput('');
    setActiveReplyId(null);
  };

  return (
    <div className="pt-1">
      <div className="space-y-4 mb-2">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-2">
            <Avatar className="size-7 mt-0.5">
              <AvatarImage src={toAbsoluteUrl(comment.authorAvatar || '')} />
              <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <Link
                    to="#"
                    className="font-medium text-foreground text-sm hover:text-primary"
                  >
                    {comment.author}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(comment.date)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveReplyId(comment.id)}
                >
                  Reply
                </Button>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs">{comment.message}</p>
              </div>
              {activeReplyId === comment.id && (
                <div className="flex gap-2">
                  <Input
                    variant="sm"
                    className="flex-1 text-sm"
                    placeholder="Write your reply..."
                    value={replyInput}
                    onChange={(e) => setReplyInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleReplyAdd(comment.id);
                      }
                    }}
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleReplyAdd(comment.id)}
                    disabled={!replyInput.trim()}
                  >
                    Send
                  </Button>
                </div>
              )}
              {comment.replies.length > 0 && (
                <div className="ml-8 space-y-3">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-2">
                      <Avatar className="size-5">
                        <AvatarImage src={toAbsoluteUrl(reply.avatar || '')} />
                        <AvatarFallback>
                          {reply.author.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <Link
                          to="#"
                          className="text-sm text-foreground font-medium hover:text-primary"
                        >
                          {reply.author}
                        </Link>
                        <div className="bg-muted/30 p-2 rounded-md">
                          <p className="text-xs">{reply.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Avatar className="size-7">
          <AvatarImage src={toAbsoluteUrl(currentUser.avatar || '')} />
          <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <Input
          variant="sm"
          className="flex-1 text-sm"
          placeholder="Write your comment..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <Button variant="primary" size="sm" onClick={handleAdd}>
          Send
        </Button>
      </div>
    </div>
  );
}
