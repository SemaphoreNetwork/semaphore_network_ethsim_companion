import { Navbar, Button, Text, Spacer } from "@nextui-org/react";
import { styled } from "@nextui-org/react"
import logo from "../logo0.png";

import { Link } from "react-router-dom";

export const Box = styled("div", {
  boxSizing: "border-box",
});

// export const Content = () => (
//     <Box css={{px: "$12", mt: "$8", "@xsMax": {px: "$10"}}}>
//       <Text h2>Lorem ipsum dolor sit amet</Text>
//       <Text size="$lg">
//         Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
//         labore et dolore magna aliqua. Purus gravida quis blandit turpis. Augue neque gravida in
//         fermentum et sollicitudin ac orci. Et sollicitudin ac orci phasellus egestas. Elementum tempus
//         egestas sed sed risus pretium quam vulputate. Interdum velit euismod in pellentesque massa
//         placerat duis ultricies.
//       </Text>
//       <Spacer y={1} />
//       </Box>
// )


// export const Layout = ({ child}) => (
//     <Box
//       css={{
//         maxW: "100%"
//       }}
//     >
//       {child}
//       <Content />
//     </Box>
//   );

export function Header() {
  return (
    <Box>
      <Navbar isBordered variant="sticky">
        <Navbar.Brand
          css={{
            maxW: "50%",
            minH: "80%",
            align: "left",
            justify: "left"
          }}>
          <img src={logo} />
          {/* <Text b color="inherit" hideIn="xs">
              Semaphore Network
            </Text> */}
        </Navbar.Brand>
        <Navbar.Content hideIn="xs" variant="underline">
          <Navbar.Link href="#">Home</Navbar.Link>
          <Navbar.Link href="/app">Wallet</Navbar.Link>
          <Navbar.Link href="/networkstats">Stats</Navbar.Link>
        </Navbar.Content>
        <Navbar.Content>
          <Navbar.Link color="inherit" href="/addhost">
            Become A Host
          </Navbar.Link>
          <Navbar.Link color="inherit" href="/addsubscriber">
            Use The Network
          </Navbar.Link>
        </Navbar.Content>
      </Navbar>
    </Box>
  )
}