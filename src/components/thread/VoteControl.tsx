import { useState } from 'react';
import { ArrowBigUp, ArrowBigDown } from 'lucide-react';
import { useVote } from '@/features/votes/useVotes';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface VoteControlProps {
  votableId: string;
  votableType: 'thread' | 'comment';
  initialScore: number;
  initialUserVote?: number;
}

export default function VoteControl({
  votableId,
  votableType,
  initialScore,
  initialUserVote = 0,
}: VoteControlProps) {
  const [score, setScore] = useState(initialScore);
  const [userVote, setUserVote] = useState(initialUserVote);
  
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const navigate = useNavigate();
  const { mutate: vote, isPending } = useVote(votableType);

  const handleVote = (type: 1 | -1) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isPending) return;

    const newVote = userVote === type ? 0 : type;
    
    const diff = newVote - userVote;

    setScore((prev) => prev + diff);
    setUserVote(newVote);

    vote(
      {
        votable_id: votableId,
        votable_type: votableType,
        vote_type: newVote,
      },
      {
        onError: () => {
          setScore((prev) => prev - diff);
          setUserVote(userVote);
        },
      }
    );
  };

  return (
    <div className="flex flex-row items-center space-x-1">
      <button
        onClick={(e) => {
          e.preventDefault();
          handleVote(1);
        }}
        disabled={isPending}
        className={cn(
          'p-1.5 rounded-full transition-colors hover:bg-paper-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600',
          userVote === 1 ? 'text-accent-600 bg-accent-50' : 'text-ink-400 hover:text-ink-600 hover:bg-paper-50'
        )}
        aria-label="Upvote"
      >
        <ArrowBigUp className="w-5 h-5" fill={userVote === 1 ? 'currentColor' : 'none'} />
      </button>
      
      <span
        className={cn(
          'text-xs font-medium font-mono text-center min-w-[2ch]',
          userVote !== 0 ? 'text-accent-600' : 'text-ink-600'
        )}
      >
        {score}
      </span>
      
      <button
        onClick={(e) => {
          e.preventDefault();
          handleVote(-1);
        }}
        disabled={isPending}
        className={cn(
          'p-1.5 rounded-full transition-colors hover:bg-paper-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600',
          userVote === -1 ? 'text-accent-600 bg-accent-50' : 'text-ink-400 hover:text-ink-600 hover:bg-paper-50'
        )}
        aria-label="Downvote"
      >
        <ArrowBigDown className="w-5 h-5" fill={userVote === -1 ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
}
