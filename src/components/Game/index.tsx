import React, { useState, useMemo, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useLongPress } from 'use-long-press';

import { BREAKPOINTS } from '../../utils/constants';

import { GameBottle } from './GameBottle';

const GameContainer = styled.section`
	width: inherit;
	height: inherit;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const GameBottleWrapper = styled.div`
	width: 7.5rem;
	margin-bottom: 3.75rem;
`;

export const Game: React.FC = () => {
	const [active, setActive] = useState(false);
	const [progress, setProgress] = useState(0);

	const onLongPress = useCallback(() => {
		setProgress((prev) => {
			return prev > 0 && prev < 100 ? prev + 1 : prev;
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
					console.log('active', prev + 0.5);
					return prev >= 0 && prev < 100 ? prev + 0.5 : prev;
				});
			}
		}, 100);

		return () => {
			clearInterval(fillTimer);
		};
	}, [active, setProgress]);

	useEffect(() => {
		const decayTimer = setInterval(() => {
			setProgress((prev) => {
				return prev > 0 && prev <= 100 ? prev - 0.1 : prev;
			});
		}, 100);

		return () => {
			clearInterval(decayTimer);
		};
	}, [setProgress]);

	const onClick = useCallback(() => {
		console.log('onClick');
		setProgress((prev) => prev + 1);
	}, [setProgress]);

	return (
		<GameContainer>
			<GameBottleWrapper>
				<GameBottle bind={bind} progress={progress} onClick={onClick} />
			</GameBottleWrapper>
		</GameContainer>
	);
};
