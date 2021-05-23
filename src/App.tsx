import React from 'react';
import styled from 'styled-components';

import { GlobalStyles } from './utils/globalStyles';
import { Game } from './components/Game';

const Container = styled.div`
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	background: #3498db;
`;

export const App: React.FC = () => {
	return (
		<Container>
			<GlobalStyles />
			<Game />
		</Container>
	);
};
