/**
 * 
 * @param {number[][]} grid 
 * @param {Array<{row, col, type}>} hls 
 * @param {number} i row
 * @param {number} j col
 * @returns {string} css_class
 */
function getCssClass(grid, hls, row, col)
{
    const cell = grid[row][col]

    const back_color = ((1 + row + col) % 2 === 0) ?
        " col_color" : " col_nocolor"

    const HLS = {
        0: "",
        1: " col_move",
        2: " col_attack"
    }

    let HL = HLS[0]
    for (const hl of hls)
    {
        if (hl.type === 1 && hl.end_row === row && hl.end_col === col)
        {
            HL = HLS[1]
            break
        }
        if (hl.type === 2 && hl.end_row === row && hl.end_col === col)
        {
            HL = HLS[2]
            break
        }
    }


    const TYPES = {
        0: "",
        1: " col_white",
        2: " col_white_queen",
        3: " col_black",
        4: " col_black_queen"
    }
    return 'col' + back_color + TYPES[cell] + HL
}
export default getCssClass