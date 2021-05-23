import React, { useState, useMemo, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useLongPress } from 'use-long-press';

import { GameBottle } from './GameBottle';

const GameContainer = styled.section`
	width: inherit;
	height: inherit;
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: center;
`;

const GameHeaderWrapper = styled.div`
	color: #ecf0f1;
	text-align: center;
`;

const GameHeaderText = styled.h1`
	margin: 0;
	font-size: 4.5rem;
	font-family: monospace;
`;

const GameHeaderLevel = styled.h1`
	margin-top: 0.5rem;
	font-size: 1.5rem;
	font-family: monospace;
`;

const GameBottleWrapper = styled.div`
	width: 7.5rem;
	margin: 3.75rem 0;
`;

const GamePauseWrapper = styled.div`
	width: 150px;
`;

const GamePauseButton = styled.button`
	width: 100%;
	padding: 8px 16px;
	color: #ecf0f1;
	outline: none;
	box-shadow: none;
	font-size: 2rem;
	border-radius: 4px;
	font-family: monospace;
	border-color: #ecf0f1;
	background-color: #2980b9;
`;

const INITIAL_LEVEL = 1;
const INITIAL_PROGRESS = 40;
const INITIAL_TIME_LEFT = 15;

const MIN_PROGRESS = 4;
const MAX_PROGRESS = 80;

export const Game: React.FC = () => {
	const [level, setLevel] = useState(INITIAL_LEVEL);
	const [paused, setPaused] = useState(true);
	const [active, setActive] = useState(false);
	const [progress, setProgress] = useState(INITIAL_PROGRESS);
	const [timeLeft, setTimeLeft] = useState(INITIAL_TIME_LEFT);

	const onLongPress = useCallback(() => {
		setProgress((prev) => {
			return prev > MIN_PROGRESS && prev < MAX_PROGRESS ? prev + 1 : prev;
		});
	}, []);

	const bind = useLongPress(onLongPress, {
		threshold: 2500,
		onStart: () => setActive(() => true),
		onFinish: () => setActive(() => false),
		onCancel: () => setActive(() => false),
	});

	useEffect(() => {
		const fillTimer = setInterval(() => {
			if (active) {
				setProgress((prev) => {
					return prev >= MIN_PROGRESS && prev < MAX_PROGRESS
						? prev + 0.5 - 0.05 * level
						: prev;
				});
			}
		}, 100);

		return () => {
			clearInterval(fillTimer);
		};
	}, [level, active, setProgress]);

	useEffect(() => {
		const decayTimer = setInterval(() => {
			if (!paused) {
				setProgress((prev) => {
					return prev > MIN_PROGRESS && prev <= MAX_PROGRESS
						? prev - 0.1 - 0.05 * level
						: prev;
				});
			}
		}, 100);

		return () => {
			clearInterval(decayTimer);
		};
	}, [level, paused, setProgress]);

	useEffect(() => {
		const timeLeftTimer = setInterval(() => {
			if (!paused) {
				setTimeLeft((prev) => {
					return prev > 0 ? prev - 1 : prev;
				});
			}
		}, 1000);

		return () => {
			clearInterval(timeLeftTimer);
		};
	}, [paused, setTimeLeft]);

	const reset = useCallback(
		(level: number) => {
			setLevel(() => level);
			setProgress(() => INITIAL_PROGRESS);
			setTimeLeft(() => INITIAL_TIME_LEFT);
		},
		[setLevel, setProgress, setTimeLeft],
	);

	useEffect(() => {
		if (timeLeft === 0 || progress <= MIN_PROGRESS) {
			reset(INITIAL_LEVEL);
		} else if (progress >= MAX_PROGRESS) {
			reset(level + 1);
		}
	}, [level, timeLeft, progress, paused, reset, setTimeLeft]);

	const onClick = useCallback(() => {
		setProgress((prev) => prev + 2 - 0.05 * level);
	}, [level, setProgress]);

	return (
		<GameContainer>
			<GameHeaderWrapper>
				<GameHeaderText>{paused ? 'Paused' : `${timeLeft}s`}</GameHeaderText>
				<GameHeaderLevel>{`Level: ${level}`}</GameHeaderLevel>
			</GameHeaderWrapper>

			<GameBottleWrapper>
				<GameBottle
					bind={bind}
					disabled={paused}
					progress={progress}
					onClick={onClick}
				/>
			</GameBottleWrapper>

			<GamePauseWrapper>
				<GamePauseButton onClick={() => setPaused((prev) => !prev)}>
					{paused ? 'Start' : 'Pause'}
				</GamePauseButton>
			</GamePauseWrapper>
		</GameContainer>
	);
};
