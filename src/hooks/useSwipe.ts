import { useState, useCallback, useMemo } from 'react';
import { Internship, Application, SwipeHistory } from '../types';
import { useAppContext } from '../context/AppContext';
import { useUserContext } from '../context/UserContext';

interface SwipeAction {
  internshipId: string;
  direction: 'left' | 'right';
  timestamp: string;
}

export function useSwipe(internships: Internship[]) {
  const { addApplication, showToast } = useAppContext();
  const { profile, updateProfile } = useUserContext();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeStack, setSwipeStack] = useState<SwipeAction[]>([]);

  // Filter out already-swiped internships
  const swipedIds = useMemo(
    () => new Set(profile.swipeHistory.map((s) => s.internshipId)),
    [profile.swipeHistory]
  );

  const availableCards = useMemo(
    () => internships.filter((i) => !swipedIds.has(i.id)),
    [internships, swipedIds]
  );

  const currentCard = availableCards[currentIndex] ?? null;
  const remainingCards = availableCards.length - currentIndex;

  const recordSwipe = useCallback(
    (internshipId: string, direction: 'left' | 'right', matchScore: number) => {
      const entry: SwipeHistory = {
        internshipId,
        direction,
        timestamp: new Date().toISOString(),
        matchScore,
      };
      updateProfile({
        swipeHistory: [...profile.swipeHistory, entry],
      });
    },
    [profile.swipeHistory, updateProfile]
  );

  const handleSwipeRight = useCallback(
    (internship: Internship) => {
      const now = new Date().toISOString();
      const autoApply = profile.autoApplyEnabled && internship.matchScore >= 80;

      const newApplication: Omit<Application, 'id'> = {
        internshipId: internship.id,
        internship,
        status: autoApply ? 'Auto_Applied' : 'Needs_Manual_Action',
        savedDate: now,
        appliedDate: autoApply ? now : undefined,
        deadlineDate: internship.deadline,
        cvVersion: 'default',
        additionalDocs: [],
        notes: '',
        aiSuggestions: [],
        confidenceScore: internship.matchScore,
        createdDate: now,
        lastUpdated: now,
        autoApplied: autoApply,
      };

      addApplication(newApplication);
      recordSwipe(internship.id, 'right', internship.matchScore);
      setSwipeStack((prev) => [
        ...prev,
        { internshipId: internship.id, direction: 'right', timestamp: now },
      ]);
      setCurrentIndex((prev) => prev + 1);

      if (autoApply) {
        showToast(`Auto-applied to ${internship.company}!`, 'success');
      } else {
        showToast(`Saved ${internship.company} - complete your application`, 'info');
      }
    },
    [addApplication, recordSwipe, profile.autoApplyEnabled, showToast]
  );

  const handleSwipeLeft = useCallback(
    (internship: Internship) => {
      recordSwipe(internship.id, 'left', internship.matchScore);
      setSwipeStack((prev) => [
        ...prev,
        {
          internshipId: internship.id,
          direction: 'left',
          timestamp: new Date().toISOString(),
        },
      ]);
      setCurrentIndex((prev) => prev + 1);
    },
    [recordSwipe]
  );

  const undoLastSwipe = useCallback(() => {
    if (swipeStack.length === 0) return;

    const lastSwipe = swipeStack[swipeStack.length - 1];

    // Remove from swipe history in profile
    updateProfile({
      swipeHistory: profile.swipeHistory.filter(
        (s) => s.internshipId !== lastSwipe.internshipId
      ),
    });

    setSwipeStack((prev) => prev.slice(0, -1));
    setCurrentIndex((prev) => Math.max(0, prev - 1));
    showToast('Last swipe undone', 'info');
  }, [swipeStack, profile.swipeHistory, updateProfile, showToast]);

  const resetAllSwipes = useCallback(() => {
    if (profile.swipeHistory.length === 0) return;

    updateProfile({ swipeHistory: [] });
    setSwipeStack([]);
    setCurrentIndex(0);
    showToast('All swipes reset for demo mode', 'info');
  }, [profile.swipeHistory.length, showToast, updateProfile]);

  return {
    currentIndex,
    currentCard,
    remainingCards,
    handleSwipeRight,
    handleSwipeLeft,
    undoLastSwipe,
    resetAllSwipes,
    canUndo: swipeStack.length > 0,
    hasSwipes: profile.swipeHistory.length > 0,
    totalCards: availableCards.length,
  };
}
