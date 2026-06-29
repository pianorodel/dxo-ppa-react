
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

// const SAMPLE_ITEMS = [
//     {
//         id: 'grid',
//         label: 'Data Grid',
//         children: [
//             { id: 'grid-community', label: '@mui/x-data-grid' },
//             { id: 'grid-pro', label: '@mui/x-data-grid-pro' },
//             { id: 'grid-premium', label: '@mui/x-data-grid-premium' },
//         ],
//     },
// ];

const theme = createTheme({
    typography: {
        fontFamily: 'Poppins, sans-serif',
        fontSize: 12,
    },
});

const TreeView = ({ items = [], onItemClick, ...props }) => {

    const firstItemId = items.length > 0 ? items[0].id : null;

    return (
        <ThemeProvider theme={theme}>
            <RichTreeView
                defaultExpandedItems={(firstItemId !== null && firstItemId !== undefined) ? [firstItemId] : [0]}
                items={items}
                onItemClick={(event, itemId) => {
                    const findItemId = (items, itemId) => {
                        for (const item of items) {
                            if (item.id === itemId) return item;
                            if (item.children) {
                                const found = findItemId(item.children, itemId);
                                if (found) return found;
                            }
                        }
                    };
                    if (onItemClick) {
                        const itemObj = findItemId(items, itemId);
                        onItemClick(itemId, itemObj);
                    }
                }}
                {...props}
            />
        </ThemeProvider>
    );
};

export default TreeView;