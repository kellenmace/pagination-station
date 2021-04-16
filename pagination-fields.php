<?php

use WP_Post;
use WPGraphQL\Model\Post;

class PaginationFields {
    public function register_hooks() {
        add_action( 'graphql_register_types', [ $this, 'register_post_fields' ] );
    }

    public function register_post_fields() {
        register_graphql_fields('Post', [
            'previousPost' => [
                'type'        => 'Post',
                'description' => __( 'Previous post', 'hwp-rockers' ),
                'resolve'     => function( Post $resolving_post ) {
                    if ( is_post_type_hierarchical( $resolving_post->post_type ) ) {
                        $previous_post_id = get_previous_page_id( $resolving_post );
                        return $previous_post_id ? new Post( $previous_post_id ) : null;
                    }

                    $post = get_post( $resolving_post->postId );
                    $GLOBALS['post'] = $post;
                    setup_postdata( $post );
                    $previous_post = get_previous_post();
                    wp_reset_postdata();

                    return $previous_post ? new Post( $previous_post ) : null;
                }
            ],
            'nextPost' => [
                'type'        => 'Post',
                'description' => __( 'Next post', 'hwp-rockers' ),
                'resolve'     => function( Post $resolving_post ) {
                    if ( is_post_type_hierarchical( $resolving_post->post_type ) ) {
                        $next_post_id = get_next_page_id( $resolving_post );
                        return $next_post_id ? new Post( $next_post_id ) : null;
                    }

                    $post = get_post( $resolving_post->postId );
                    $GLOBALS['post'] = $post;
                    setup_postdata( $post );
                    $next_post = get_next_post();
                    wp_reset_postdata();

                    return $next_post ? new Post( $next_post ) : null;
                }
            ],
        ]);
    }

    private function get_previous_page_id( Post $page ): int {
        return get_adjacent_page_id( $page, -1 );
    }

    private function get_next_page_id( Post $page ): int {
    	return get_adjacent_page_id( $page, 1 );
    }

    /*
     * @param WP_Post $page      Page Object.
     * @param int     $direction Integer -1 or 1 indicating next or previous post.
     *
     * @return int Adjacent page id, or 0 if none.
     */
    private function get_adjacent_page_id( WP_Post $page, int $direction ): int {
        $args = [
            'post_type'      => $page->post_type,
            'order'          => 'ASC',
            'orderby'        => 'menu_order',
            'post_parent'    => $page->post_parent,
            'fields'         => 'ids',
            'posts_per_page' => -1
        ];

        $pages = get_posts( $args );
        $current_key = array_search( $page->ID, $pages );
        $does_adjacent_page_exist = isset( $pages[ $current_key + $direction ] );

        if ( $does_adjacent_page_exist ) {
            return $pages[ $current_key + $direction ];
        }

        return 0;
    }
}

add_action( 'plugins_loaded', function() {
    $pagination_fields = new PaginationFields();
    $pagination_fields->register_hooks();
} );
